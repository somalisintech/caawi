'use client';

import { Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { SignOutMenuButton } from '@/components/auth/sign-out-menu-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

type UserData = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  image: string | null;
} | null;

export function LandingNav({
  dark,
  onToggleTheme,
  user
}: {
  dark: boolean;
  onToggleTheme: () => void;
  user: UserData;
}) {
  return (
    <header>
      <nav className="flex w-full items-center justify-between px-[60px] py-[40px] max-lg:px-10 max-sm:px-6">
        <div className="text-2xl font-extrabold tracking-tight">caawi.</div>
        <div className="flex items-center gap-6">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors ${
                  dark ? 'border-white/30 hover:border-white' : 'border-black/15 hover:border-black/40'
                }`}
              >
                <Avatar className="size-6">
                  {user.image ? <AvatarImage src={user.image} alt="" /> : null}
                  <AvatarFallback className="bg-transparent text-sm">{user.firstName?.at(0) ?? '-'}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.firstName}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className={dark ? 'border-white/15 bg-[#2a2a2a] text-white' : 'border-black/10 bg-white text-[#1a1a1a]'}
              >
                <DropdownMenuItem
                  className={`cursor-pointer ${dark ? 'focus:bg-white/10 focus:text-white' : ''}`}
                  asChild
                >
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`cursor-pointer ${dark ? 'focus:bg-white/10 focus:text-white' : ''}`}
                  asChild
                >
                  <Link href="/dashboard/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className={dark ? 'bg-white/15' : ''} />
                <DropdownMenuItem className={dark ? 'focus:bg-white/10 focus:text-white' : ''}>
                  <SignOutMenuButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/auth"
              className={`text-sm font-medium transition-opacity ${dark ? 'text-white/80 hover:text-white' : 'text-black/60 hover:text-black'}`}
            >
              Log in
            </Link>
          )}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`flex size-9 items-center justify-center rounded-full border transition-colors ${
              dark ? 'border-white/30 hover:border-white' : 'border-black/15 hover:border-black/40'
            }`}
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
      </nav>
    </header>
  );
}
