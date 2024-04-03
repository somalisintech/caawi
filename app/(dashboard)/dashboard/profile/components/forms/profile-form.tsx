'use client';

import { ReactElement, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ProfileFormFields, profileFormSchema } from './profile-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Gender } from '@prisma/client';
import { roles } from '@/constants/roles';
import { companies } from '@/constants/companies';
import { locations } from '@/constants/locations';
import { UserWithProfile } from '@/types/user';
import Image from 'next/image';

interface Props {
  calendlyConnectionButton: ReactElement;
  user: UserWithProfile;
}

export function ProfileForm({ user, calendlyConnectionButton }: Props) {
  const { firstName, lastName, email, profile } = user;

  const form = useForm<ProfileFormFields>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      gender: profile?.gender as Gender,
      bio: profile?.bio || '',
      linkedinUrl: '',
      githubUrl: '',
      sameGenderPref: profile?.sameGenderPref ?? undefined,
      country: profile?.location?.country ?? undefined,
      city: profile?.location?.city ?? undefined,
      role: profile?.occupation?.role ?? undefined,
      company: profile?.occupation?.company ?? undefined,
      yearsOfExperience: profile?.occupation?.yearsOfExperience ?? undefined
    }
  });

  const country = form.watch('country', '');

  useEffect(() => {
    form.setValue('city', undefined);
  }, [form, country]);

  async function onSubmit(data: ProfileFormFields) {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ ...data })
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
        <Card>
          <CardHeader className="border-b-[1px]">
            <CardTitle>Basic profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
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
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-48 overflow-y-auto">
                        <SelectItem value={Gender.MALE}>Male</SelectItem>
                        <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                      </SelectContent>
                    </Select>
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
                    Share a glimpse of who you are with us and your potential mentees. Speak in the first person, as
                    though you&apos;re conversing with a mentee. This information will be publicly displayed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <FormField
                control={form.control}
                name="linkedinUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {profile?.userType === 'MENTOR' && (
          <Card>
            <CardHeader className="border-b-[1px]">
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="sameGenderPref"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-0.5">
                      <FormLabel>Same gender</FormLabel>
                      <FormDescription>
                        Only mentees with the same gender as you will be able to request mentorship.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="border-b-[1px]">
            <CardTitle>Occupation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-48 overflow-y-auto">
                        {roles.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-48 overflow-y-auto">
                        {companies.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="yearsOfExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b-[1px]">
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue className="line-clamp-1" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-48 overflow-y-auto">
                        {locations
                          .map((c) => c.name)
                          .map((n) => (
                            <SelectItem key={n} value={n} className="line-clamp-1">
                              {n}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-48 overflow-y-auto">
                        {(locations.find((l) => l.name === country)?.states || []).map((c) => (
                          <SelectItem key={c.name} value={c.name} className="line-clamp-1">
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {profile?.userType === 'MENTOR' && (
          <Card>
            <CardHeader className="border-b-[1px]">
              <CardTitle>Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div className="relative h-6 w-24">
                  <Image src="/calendly-icon.png" alt="Calendly logo" fill className="object-contain" />
                </div>
                {calendlyConnectionButton}
              </div>
            </CardContent>
          </Card>
        )}
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  );
}
