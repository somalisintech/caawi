'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { UserType } from '@/generated/prisma/browser';
import { SKILLS_BY_CATEGORY } from '@/lib/constants/skills';
import { OnboardingProgress } from './onboarding-progress';
import { ProfileStep } from './steps/profile-step';
import { RoleStep } from './steps/role-step';
import { SkillsStep } from './steps/skills-step';

type OnboardingUser = {
  firstName: string | null;
  lastName: string | null;
  profile: {
    userType: UserType | null;
    gender: string | null;
    bio: string | null;
    onboardingCompleted: boolean;
    location: { city: string | null; country: string | null } | null;
    occupation: { role: string | null; company: string | null } | null;
    skills: { name: string }[];
  } | null;
};

export type OnboardingData = {
  userType: UserType | null;
  firstName: string;
  lastName: string;
  gender: string;
  bio: string;
  country: string;
  city: string;
  role: string;
  company: string;
  skills: string[];
};

type Props = {
  user: OnboardingUser;
};

const STEP_META: { [K in 1 | 2 | 3]: { title: string; description: (isMentor: boolean) => string } } = {
  1: { title: 'How would you like to use Caawi?', description: () => 'You can always change this later' },
  2: {
    title: 'Tell us about yourself',
    description: (isMentor) => (isMentor ? 'Help mentees get to know you' : 'Help us find the right mentors for you')
  },
  3: { title: 'What are your skills?', description: () => 'Select the skills that best describe you' }
};

export function OnboardingFlow({ user }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<OnboardingData>(() => ({
    userType: user.profile?.userType ?? null,
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    gender: user.profile?.gender ?? '',
    bio: user.profile?.bio ?? '',
    country: user.profile?.location?.country ?? '',
    city: user.profile?.location?.city ?? '',
    role: user.profile?.occupation?.role ?? '',
    company: user.profile?.occupation?.company ?? '',
    skills: user.profile?.skills.map((s) => s.name) ?? []
  }));

  const updateData = useCallback((partial: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const next = useCallback(() => setStep((s) => Math.min(s + 1, 3)), []);
  const back = useCallback(() => setStep((s) => Math.max(s - 1, 1)), []);

  const submit = useCallback(async (finalData: OnboardingData) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userType: finalData.userType,
          firstName: finalData.firstName,
          lastName: finalData.lastName,
          gender: finalData.gender,
          bio: finalData.bio || null,
          country: finalData.country || null,
          city: finalData.city || null,
          role: finalData.role || null,
          company: finalData.company || null,
          skills: finalData.skills,
          onboardingCompleted: true
        })
      });

      if (!response.ok) {
        toast.error('Something went wrong. Please try again.');
        return false;
      }

      return true;
    } catch {
      toast.error('Something went wrong. Please try again.');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const handleSkillsNext = useCallback(async () => {
    const ok = await submit(data);
    if (ok) router.push('/dashboard');
  }, [data, submit, router]);

  const isMentor = data.userType === 'MENTOR';
  const meta = STEP_META[step as keyof typeof STEP_META];

  return (
    <div className="space-y-6">
      <OnboardingProgress currentStep={step} />
      <Card className="min-h-[420px]">
        <CardHeader className="text-center">
          <CardTitle className="text-balance text-2xl">{meta.title}</CardTitle>
          <CardDescription className="text-pretty">{meta.description(isMentor)}</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <RoleStep
              value={data.userType}
              onSelect={(userType) => {
                updateData({ userType });
                next();
              }}
            />
          ) : null}
          {step === 2 ? <ProfileStep data={data} onUpdate={updateData} onNext={next} onBack={back} /> : null}
          {step === 3 ? (
            <SkillsStep
              selected={data.skills}
              skillsByCategory={SKILLS_BY_CATEGORY}
              onUpdate={updateData}
              onNext={handleSkillsNext}
              onBack={back}
              submitting={submitting}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
