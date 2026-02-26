import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { DashboardMenu } from '@/components/layout/dashboard-menu';
import { Header } from '@/components/layout/header';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Caawi dashboard page.'
};

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect('/auth');
  }

  const user = await prisma.user.findUnique({
    where: {
      email: data.user.email
    },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      profile: {
        select: {
          id: true,
          bio: true,
          gender: true,
          userType: true,
          linkedInUrl: true,
          githubUrl: true,
          buyMeCoffeeUrl: true,
          onboardingCompleted: true,
          occupation: true,
          location: true,
          calendlyUser: true
        }
      }
    }
  });

  if (!user) {
    logger.warn('User not found', { data });
    redirect('/auth');
  }

  if (!user.profile?.onboardingCompleted) {
    redirect('/onboarding');
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <Header />
      </div>
      <DashboardMenu userType={user.profile?.userType ?? 'MENTEE'} />
      <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-10 md:px-8 md:pt-12">
        <main>{children}</main>
      </div>
    </div>
  );
}
