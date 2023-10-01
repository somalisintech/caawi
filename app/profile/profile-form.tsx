'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RxTrash } from 'react-icons/rx';
import { $Enums, Profile } from '@prisma/client';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Gender = $Enums.Gender;

const profileFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First Name is required' }),
  lastName: z.string().min(1, { message: 'Last Name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  gender: z.enum(['MALE', 'FEMALE'], {
    invalid_type_error: 'Required'
  }),
  bio: z.string(),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: 'Please enter a valid URL.' })
      })
    )
    .optional()
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultValues: Partial<ProfileFormValues> = {
  firstName: '',
  lastName: '',
  bio: '',
  urls: [{ value: '' }]
};

interface Props {
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  profile: Profile | null;
}

export function ProfileForm({ firstName, lastName, email, profile }: Props) {
  defaultValues.firstName = firstName || '';
  defaultValues.lastName = lastName || '';
  defaultValues.email = email || '';
  defaultValues.gender = profile?.gender as Gender;
  defaultValues.bio = profile?.bio || '';

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues
  });

  const { fields, append, remove } = useFieldArray({
    name: 'urls',
    control: form.control
  });

  async function onSubmit(data: ProfileFormValues) {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      toast({ title: 'Update failed', variant: 'destructive' });
      return;
    }

    toast({
      title: 'Updated'
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700">First Name</FormLabel>
                <FormControl>
                  <Input {...field} type={'text'} />
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
                <FormLabel className="block text-sm font-medium text-gray-700">Last Name</FormLabel>
                <FormControl>
                  <Input {...field} type={'text'} />
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
            <FormItem>
              <FormLabel className="block text-sm font-medium text-gray-700">Email</FormLabel>
              <FormControl>
                <Input {...field} type={'email'} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
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
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && event.metaKey) {
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                Share a glimpse of who you are with us and your potential mentees. Speak in the first person, as though
                you&apos;re conversing with a mentee. This information will be publicly displayed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && 'sr-only')}>URLs</FormLabel>
                  <FormDescription className={cn(index !== 0 && 'sr-only')}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>
                  <FormControl>
                    <div className="flex w-full max-w-sm items-center space-x-1">
                      <Input {...field} />
                      <Button
                        variant="secondary"
                        type="button"
                        size="icon"
                        onClick={() => remove(index)}
                        title="Delete URL"
                      >
                        <RxTrash size={16} />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ value: '' })}>
            Add URL
          </Button>
        </div>
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  );
}
