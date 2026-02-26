import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import prisma from '@/lib/db';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Get Started',
  description: 'Complete your Caawi profile to get started.'
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect('/auth');
  }

  const user = await prisma.user.findUnique({
    where: { email: data.user.email },
    select: {
      firstName: true,
      lastName: true,
      profile: {
        select: {
          userType: true,
          gender: true,
          bio: true,
          onboardingCompleted: true,
          location: { select: { city: true, country: true } },
          occupation: { select: { role: true, company: true } },
          skills: { select: { name: true } }
        }
      }
    }
  });

  if (!user) {
    redirect('/auth');
  }

  if (user.profile?.onboardingCompleted) {
    redirect('/dashboard');
  }

  return <OnboardingFlow user={user} />;
}
