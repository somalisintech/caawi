import Link from 'next/link';
import { SignOutMenuButton } from '@/components/auth/sign-out-menu-button';
import { CaawiLogo } from '@/components/brand/caawi-logo';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import prisma from '@/lib/db';
import { createClient } from '@/utils/supabase/server';

export async function Header() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!data.user || error) {
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

  const user = await prisma.user.findUnique({
    where: {
      email: data.user.email
    },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      image: true
    }
  });

  const avatarImage = user?.image ?? '';
  const avatarFallback = user?.firstName?.at(0) ?? '-';

  const name = [user?.firstName, user?.lastName].join(' ');

  return (
    <header className="flex items-center justify-between py-5">
      <div className="flex items-center gap-3">
        <CaawiLogo href="/dashboard" />
        <div className="text-lg font-medium">Caawi</div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center gap-2 px-2" variant="outline">
              <div className="flex items-center gap-2">
                <Avatar className="size-6">
                  <AvatarImage src={avatarImage} alt="" />
                  <AvatarFallback className="text-sm bg-transparent">{avatarFallback}</AvatarFallback>
                </Avatar>
              </div>
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
