import { CalendarX2 } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { DashboardMenu } from '@/components/layout/dashboard-menu';
import { Header } from '@/components/layout/header';
import { ProfileSummary } from '@/components/layout/profile-summary';
import { CompleteProfile } from '@/components/profile/complete-profile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 to-primary/20 dark:from-zinc-950 dark:to-primary/10">
      <CompleteProfile user={user} />
      <div className="container">
        <Header />
      </div>
      <div className="container pb-8">
        {user.profile?.userType === 'MENTOR' && !user.profile.calendlyUser && (
          <Alert className="mb-4">
            <CalendarX2 />
            <AlertTitle>Calendly not connected</AlertTitle>
            <AlertDescription>
              Mentees won&apos;t be able to book sessions with you.{' '}
              <Link href="/dashboard/profile" className="font-medium underline">
                Connect Calendly in your profile settings
              </Link>
            </AlertDescription>
          </Alert>
        )}
        <div className="flex gap-8">
          <div className="flex flex-1 flex-col gap-4">
            <DashboardMenu />
            <main>{children}</main>
          </div>
          <div className="hidden lg:block">
            <ProfileSummary user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
