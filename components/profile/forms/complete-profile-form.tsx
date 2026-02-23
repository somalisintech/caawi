'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Gender, UserType } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import type { UserWithProfile } from '@/types/user';
import { type CompleteProfileFormFields, completeProfileFormSchema } from './complete-profile-schema-schema';

interface Props {
  user: UserWithProfile;
  onComplete: CallableFunction;
}

export function CompleteProfileForm({ user, onComplete }: Props) {
  const { firstName, lastName, email, profile } = user;

  const form = useForm<CompleteProfileFormFields>({
    resolver: zodResolver(completeProfileFormSchema),
    defaultValues: {
      userType: profile?.userType as UserType,
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      gender: profile?.gender as Gender,
      bio: profile?.bio || ''
    }
  });

  async function onSubmit(data: CompleteProfileFormFields) {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      toast({ title: 'Update failed', variant: 'destructive' });
      return;
    }

    onComplete();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="userType"
          render={({ field }) => (
            <FormItem className="flex flex-1 flex-col items-start gap-2">
              <FormLabel>User type</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-1">
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={UserType.MENTEE} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Mentee{' '}
                      <span className="text-muted-foreground">- Receive mentorship from experienced professionals</span>
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={UserType.MENTOR} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Mentor <span className="text-muted-foreground">- Offer mentorship to passionate individuals</span>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-1 flex-col items-start">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" disabled={!!email} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="flex flex-1 flex-col items-start gap-2">
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-1">
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={Gender.MALE} />
                    </FormControl>
                    <FormLabel className="font-normal">Male</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={Gender.FEMALE} />
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
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && event.metaKey) {
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                />
              </FormControl>
              <FormDescription className="text-left">
                Share a glimpse of who you are with us and your potential mentees. Speak in the first person, as though
                you&apos;re conversing with a mentee. This information will be publicly displayed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" className="gap-2">
            {form.formState.isSubmitting && <Loader2 className="animate-spin" size={16} />}
            Complete profile
          </Button>
        </div>
      </form>
    </Form>
  );
}
