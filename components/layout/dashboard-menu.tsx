'use client';

import { CalendarDays, Home, User, UserSearch, Users } from 'lucide-react';
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
    ...(isMentor
      ? [
          {
            href: '/dashboard/browse-mentees',
            icon: UserSearch,
            label: 'Find Mentees'
          }
        ]
      : []),
    ...(!isMentor
      ? [
          {
            href: '/dashboard/mentors',
            icon: UserSearch,
            label: 'Find a Mentor'
          }
        ]
      : []),
    { href: '/dashboard/profile', icon: User, label: 'Profile' }
  ];

  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto flex h-10 max-w-[1200px] items-center gap-1 overflow-x-auto px-1 md:px-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex h-full shrink-0 items-center gap-1.5 whitespace-nowrap px-3 text-sm text-muted-foreground transition-colors hover:text-foreground',
                isActive && 'font-semibold text-foreground'
              )}
            >
              <item.icon className="size-4" />
              {item.label}
              {isActive && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-foreground" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
