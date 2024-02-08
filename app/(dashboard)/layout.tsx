import { Metadata } from 'next';
import { ReactNode } from 'react';
import { SidebarNav } from '@/app/(dashboard)/dashboard/components/sidebar-nav';
import { Separator } from '@/components/ui/separator';
import TopNav from '@/components/TopNav';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Caawi dashboard page.'
};

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '/dashboard'
  },
  {
    title: 'Account',
    href: '/dashboard/account'
  },
  {
    title: 'Appearance',
    href: '/dashboard/appearance'
  },
  {
    title: 'Notifications',
    href: '/dashboard/notifications'
  },
  {
    title: 'Display',
    href: '/dashboard/display'
  }
];

interface SettingsLayoutProps {
  children: ReactNode;
}

export default async function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <TopNav />
      <div className="space-y-6 px-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your profile settings here.</p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} className="overflow-auto scrollbar-hide" />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  );
}
