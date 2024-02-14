'use client';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ProfileFormFields, profileFormSchema } from './profile-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { Gender, Profile, User } from '@prisma/client';
import { TrashIcon } from 'lucide-react';

interface Props {
  user: Partial<User & { profile: Profile }>;
}

export function ProfileForm({ user }: Props) {
  const { firstName, lastName, email, profile } = user;

  const form = useForm<ProfileFormFields>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      gender: profile?.gender as Gender,
      bio: profile?.bio || '',
      urls: [{ value: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    name: 'urls',
    control: form.control
  });

  async function onSubmit(data: ProfileFormFields) {
    const urls = data.urls?.filter((url) => !!url.value);

    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ ...data, urls })
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
        <div className="flex max-w-sm items-center space-x-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
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
              <FormItem>
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
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" disabled />
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
                    <div className="flex max-w-sm items-center space-x-2">
                      <Input {...field} />
                      <Button
                        variant="secondary"
                        type="button"
                        size="icon"
                        onClick={() => remove(index)}
                        title="Delete URL"
                      >
                        <TrashIcon size={16} />
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
