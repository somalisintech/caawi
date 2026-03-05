'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { SkillPicker } from '@/components/skills/skill-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Gender, UserType } from '@/generated/prisma/browser';
import { SKILLS_BY_CATEGORY } from '@/lib/constants/skills';
import type { UserWithProfile } from '@/types/user';
import { DeleteAccountModal } from '../modals/delete-account-modal';
import { ProfileFormImage } from './profile-form-image';
import { type ProfileFormFields, profileFormSchema } from './profile-form-schema';

interface Props {
  calendlyConnectionButton: ReactElement;
  user: UserWithProfile;
}

export function ProfileForm({ user, calendlyConnectionButton }: Props) {
  const router = useRouter();
  const { firstName, lastName, email, profile } = user;

  const form = useForm<ProfileFormFields, unknown, ProfileFormFields>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      userType: profile?.userType as UserType,
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      gender: profile?.gender as Gender,
      bio: profile?.bio || '',
      yearsOfExperience: profile?.yearsOfExperience ?? undefined,
      linkedInUrl: profile?.linkedInUrl ?? undefined,
      githubUrl: profile?.githubUrl ?? undefined,
      buyMeCoffeeUrl: profile?.buyMeCoffeeUrl ?? undefined,
      sameGenderPref: profile?.sameGenderPref ?? undefined,
      country: profile?.location?.country ?? undefined,
      city: profile?.location?.city ?? undefined,
      role: profile?.occupation?.role ?? undefined,
      company: profile?.occupation?.company ?? undefined,
      skills: profile?.skills?.map((s: { name: string }) => s.name) ?? []
    }
  });

  async function onSubmit(data: ProfileFormFields) {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ ...data })
    });

    if (!response.ok) {
      toast.error('Update failed');
      return;
    }

    toast.success('Updated');

    router.refresh();
  }

  const watchedUserType = form.watch('userType');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader className="border-b-DEFAULT">
            <CardTitle>Account type</CardTitle>
          </CardHeader>
          <CardContent className="py-4">
            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={UserType.MENTEE} />
                        </FormControl>
                        <FormLabel className="font-normal">Mentee</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={UserType.MENTOR} />
                        </FormControl>
                        <FormLabel className="font-normal">Mentor</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Switch between mentee and mentor. Mentor profiles are publicly listed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {watchedUserType === 'MENTOR' && (
          <Card>
            <CardHeader className="border-b-DEFAULT">
              <CardTitle>Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-6 w-24">
                    <Image src="/calendly-icon.png" alt="Calendly logo" fill sizes="96px" className="object-contain" />
                  </div>
                </div>
                {calendlyConnectionButton}
              </div>
              <p className="text-sm text-muted-foreground">
                Connect your Calendly account so mentees can book sessions with you directly from your profile.
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="border-b-DEFAULT">
            <CardTitle className="flex items-center justify-between">
              <div>Basic profile</div>
              <ProfileFormImage user={user} />
            </CardTitle>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled>
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
            <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedInUrl"
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
            {watchedUserType === UserType.MENTOR && (
              <FormField
                control={form.control}
                name="buyMeCoffeeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buy me coffee</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {watchedUserType === 'MENTOR' && (
          <Card>
            <CardHeader className="border-b-DEFAULT">
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
          <CardHeader className="border-b-DEFAULT">
            <CardTitle>Occupation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
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
                    <FormLabel>Company</FormLabel>
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

        <Card>
          <CardHeader className="border-b-DEFAULT">
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
                    <FormControl>
                      <Input {...field} type="text" />
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
                    <FormLabel>City</FormLabel>
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

        <Card>
          <CardHeader className="border-b-DEFAULT">
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent className="py-4">
            <SkillPicker
              selected={form.watch('skills') ?? []}
              skillsByCategory={SKILLS_BY_CATEGORY}
              onChange={(skills) => form.setValue('skills', skills, { shouldDirty: true })}
            />
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button type="submit" className="gap-2">
            {form.formState.isSubmitting && <Loader2 className="animate-spin" size={16} />}
            Update profile
          </Button>
          <DeleteAccountModal />
        </div>
      </form>
    </Form>
  );
}
