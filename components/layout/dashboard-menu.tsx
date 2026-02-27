'use client';

import { CalendarDays, Home, Search, User, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type Props = {
  userType: string;
};

export function DashboardMenu({ userType }: Props) {
  const pathname = usePathname();
  const isMentor = userType === 'MENTOR';

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Home', exact: true },
    { href: '/dashboard/sessions', icon: CalendarDays, label: 'Sessions' },
    ...(isMentor ? [{ href: '/dashboard/mentees', icon: Users, label: 'Mentees' }] : []),
    {
      href: '/dashboard/mentors',
      icon: Search,
      label: isMentor ? 'Browse' : 'Find a Mentor'
    },
    { href: '/dashboard/profile', icon: User, label: 'Profile' }
  ];

  return (
    <nav className="border-b border-border bg-white dark:bg-zinc-950">
      <div className="mx-auto flex h-12 max-w-[1200px] items-center gap-1 overflow-x-auto px-5 md:h-16 md:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex h-full items-center gap-1.5 px-3 text-sm text-[#777] transition-colors hover:text-foreground dark:text-zinc-500 dark:hover:text-zinc-200',
                isActive && 'font-semibold text-foreground dark:text-zinc-100'
              )}
            >
              <item.icon className="size-4" />
              {item.label}
              {isActive && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-foreground dark:bg-zinc-100" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
