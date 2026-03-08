'use client';

import Link from 'next/link';
import { SignOutMenuButton } from '@/components/auth/sign-out-menu-button';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type UserData = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  image: string | null;
} | null;

export function Nav({ user, className }: { user: UserData; className?: string }) {
  return (
    <header>
      <nav className={cn('flex w-full items-center justify-between pt-4 pb-0', className)}>
        <Link href={user ? '/dashboard' : '/'} className="text-lg font-extrabold tracking-tight">
          caawi.
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-background flex items-center gap-2 rounded-full border border-border px-3 py-1.5 transition-colors hover:border-foreground/40">
                <Avatar className="size-6">
                  {user.image ? <AvatarImage src={user.image} alt="" /> : null}
                  <AvatarFallback className="bg-transparent text-sm">{user.firstName?.at(0) ?? '-'}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.firstName}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href="/dashboard/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <SignOutMenuButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/auth"
              className="text-sm border border-border rounded-full px-3 py-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Log in
            </Link>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
