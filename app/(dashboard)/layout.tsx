import { Metadata } from 'next';
import { PropsWithChildren } from 'react';
import { SidebarNav } from '@/app/(dashboard)/dashboard/components/sidebar-nav';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/layout/header';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Caawi dashboard page.'
};

const sidebarNavItems = [
  {
    title: 'Overview',
    href: '/dashboard'
  },
  {
    title: 'Profile',
    href: '/dashboard/profile'
  },
  {
    title: 'Account',
    href: '/dashboard/account'
  },
  {
    title: 'Notifications',
    href: '/dashboard/notifications'
  }
];

export default async function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <>
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
          <main className="flex-1 lg:max-w-2xl">{children}</main>
        </div>
      </div>
    </>
  );
}
