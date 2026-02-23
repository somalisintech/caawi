import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { Header } from '@/components/layout/header';
import { ProfileSummary } from '@/components/layout/profile-summary';
import { CompleteProfile } from '@/components/profile/complete-profile';
import { DashboardMenu } from '@/components/layout/dashboard-menu';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/db';
import { log } from 'next-axiom';

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
          occupation: true,
          location: true
        }
      }
    }
  });

  if (!user) {
    log.warn('User not found', { data });
    redirect('/auth');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-primary/20 dark:from-zinc-950 dark:to-primary/10">
      <CompleteProfile user={user} />
      <div className="container">
        <Header />
      </div>
      <div className="container pb-8">
        <div className="flex gap-8">
          <div className="flex flex-1 flex-col gap-4">
            <DashboardMenu />
            <div role="main">{children}</div>
          </div>
          <div className="hidden lg:block">
            <ProfileSummary user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
