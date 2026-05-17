'use client';

import { BarChart3, Flag, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/dashboard/admin/users', icon: Users, label: 'Users' },
  { href: '/dashboard/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/dashboard/admin/reports', icon: Flag, label: 'Reports' }
];

export function AdminSubNav() {
  const pathname = usePathname();

  return (
    <nav className="-mx-1 flex items-center gap-1 overflow-x-auto border-b border-border [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'relative flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap px-3 text-sm text-muted-foreground transition-colors hover:text-foreground',
              isActive && 'font-semibold text-foreground'
            )}
          >
            <tab.icon className="size-4" />
            {tab.label}
            {isActive && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-foreground" />}
          </Link>
        );
      })}
    </nav>
  );
}
