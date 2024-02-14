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
import { authOptions } from '@/app/api/auth/authOptions';
import { getServerSession } from 'next-auth';
import { ChevronDown } from 'lucide-react';

export async function Header() {
  const session = await getServerSession(authOptions);

  if (session) {
    const { user } = session;

    const avatarImage = user.image ?? '';
    const avatarFallback = user.name?.[0] ?? '-';

    return (
      <header className="flex items-center justify-between p-5">
        <CaawiLogo />
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
                  <div>{session.user.name}</div>
                </div>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/dashboard">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/dashboard/account">Account</Link>
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
    <header className="flex items-center justify-between p-5">
      <CaawiLogo />
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <Button variant="outline" asChild className="ml-auto">
          <Link href="/login">Sign in</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Join</Link>
        </Button>
      </div>
    </header>
  );
}
