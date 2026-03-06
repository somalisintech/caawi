'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import type { OnboardingData } from '../onboarding-flow';

const profileSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  gender: z.enum(['MALE', 'FEMALE'], { error: 'Required' }),
  bio: z.string().max(1000, 'Max 1000 characters').optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  role: z.string().optional(),
  company: z.string().optional()
});

const mentorProfileSchema = profileSchema.superRefine((d, ctx) => {
  if (!d.bio) {
    ctx.addIssue({ code: 'custom', path: ['bio'], message: 'Required for mentors', input: d.bio });
  }
});

type FormFields = z.infer<typeof profileSchema>;

type Props = {
  data: OnboardingData;
  onUpdate: (partial: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
};

export function ProfileStep({ data, onUpdate, onNext, onBack }: Props) {
  const isMentor = data.userType === 'MENTOR';

  const form = useForm<FormFields>({
    resolver: zodResolver(isMentor ? mentorProfileSchema : profileSchema),
    defaultValues: {
      firstName: data.firstName,
      lastName: data.lastName,
      gender: (data.gender as 'MALE' | 'FEMALE') || undefined,
      bio: data.bio,
      country: data.country,
      city: data.city,
      role: data.role,
      company: data.company
    }
  });

  function onSubmit(values: FormFields) {
    onUpdate(values);
    onNext();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="MALE" />
                    </FormControl>
                    <FormLabel className="font-normal">Male</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="FEMALE" />
                    </FormControl>
                    <FormLabel className="font-normal">Female</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio {isMentor ? null : <span className="text-muted-foreground">(optional)</span>}</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Tell us a bit about yourself" className="resize-none" rows={3} />
              </FormControl>
              {isMentor ? (
                <FormDescription className="text-pretty">
                  Share a glimpse of who you are with potential mentees. This will be publicly displayed.
                </FormDescription>
              ) : null}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Country <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. United Kingdom" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  City <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. London" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Job title <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. Software Engineer" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Company <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. Google" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-between pt-2">
          <Button type="button" variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
          <Button type="submit">
            Next
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
