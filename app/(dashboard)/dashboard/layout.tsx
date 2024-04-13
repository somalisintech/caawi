import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { Header } from '@/components/layout/header';
import { ProfileSummary } from '@/components/layout/profile-summary';
import { CompleteProfile } from '@/components/profile/complete-profile';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/db';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Caawi dashboard page.'
};

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw redirect('/auth');
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: data.user.id
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-primary/20 dark:from-zinc-950 dark:to-primary/10">
      <CompleteProfile user={user} />
      <div className="container">
        <Header />
      </div>
      <div className="container pb-8">
        <div className="flex gap-8">
          <div className="flex-1" role="main">
            {children}
          </div>
          <ProfileSummary user={user} />
        </div>
      </div>
    </div>
  );
}
