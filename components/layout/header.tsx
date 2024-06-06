import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CaawiLogo } from '@/components/brand/caawi-logo';
import { SignOutMenuButton } from '@/components/auth/sign-out-menu-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { ChevronDown } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/db';

export async function Header() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  const user = data.user
    ? await prisma.user.findUnique({
        where: {
          id: data.user?.id
        },
        select: {
          firstName: true,
          lastName: true,
          email: true,
          image: true
        }
      })
    : null;

  if (user) {
    const avatarImage = user.image ?? '';
    const avatarFallback = user.firstName?.[0] ?? '-';

    const name = [user.firstName, user.lastName].join(' ');

    return (
      <header className="flex items-center justify-between py-5">
        <div className="flex items-center gap-3">
          <CaawiLogo />
          <div className="text-lg font-medium">Caawi</div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-2 px-2" variant="secondary">
                <div className="flex items-center gap-2">
                  <Avatar className="size-6">
                    <AvatarImage src={avatarImage} alt="" />
                    <AvatarFallback className="text-sm">{avatarFallback}</AvatarFallback>
                  </Avatar>
                  <div>{name}</div>
                </div>
                <ChevronDown size={16} />
              </Button>
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
        </div>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between py-5">
      <CaawiLogo />
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <Button variant="outline" asChild className="ml-auto">
          <Link href="/auth">Sign in</Link>
        </Button>
        <Button asChild>
          <Link href="/auth">Join Caawi</Link>
        </Button>
      </div>
    </header>
  );
}
