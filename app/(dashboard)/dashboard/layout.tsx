import { Metadata } from 'next';
import { PropsWithChildren } from 'react';
import { UserType } from '@prisma/client';
import { Separator } from '@/components/ui/separator';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Header } from '@/components/layout/header';
import { CompleteProfile } from '@/components/profile/complete-profile';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Caawi dashboard page.'
};

const sidebarNavItems = [
  {
    title: 'Overview',
    href: '/dashboard',
    roles: [UserType.MENTEE, UserType.MENTOR]
  },
  {
    title: 'Profile',
    href: '/dashboard/profile',
    roles: [UserType.MENTEE, UserType.MENTOR]
  },
  {
    title: 'Notifications',
    href: '/dashboard/notifications',
    roles: [UserType.MENTEE, UserType.MENTOR]
  },
  {
    title: 'Mentors',
    href: '/dashboard/mentors',
    roles: [UserType.MENTEE, UserType.MENTOR]
  }
];

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
          isComplete: true
        }
      }
    }
  });

  return (
    <>
      <CompleteProfile user={user} />
      <Header />
      <div className="container max-w-screen-2xl pb-8">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back</p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} className="overflow-auto scrollbar-hide" />
          </aside>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </>
  );
}
