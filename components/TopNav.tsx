import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import { SignOutButton } from '@/components/SignOutButton';
import { CaawiLogo } from '@/components/CaawiLogo';

export default async function TopNav() {
  const session = await getServerSession(authOptions);

  if (session) {
    const initials = session.user.name
      ?.split(' ')
      .map((n) => n[0])
      .join('');

    const { image } = session.user;

    return (
      <div className="flex space-x-2 p-5">
        <CaawiLogo className="mr-auto" />
        <Avatar className="ml-auto">
          <AvatarImage src={image as string} alt="" />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <Button variant="outline" asChild>
          <Link href={'/dashboard'}>Dashboard</Link>
        </Button>
        <SignOutButton />
      </div>
    );
  }

  return (
    <div className="flex space-x-2 p-5">
      <CaawiLogo className="mr-auto" />
      <Button variant="outline" asChild className="ml-auto">
        <Link href={'/login'}>Sign in</Link>
      </Button>
      <Button asChild>
        <Link href={'/register'}>Sign up</Link>
      </Button>
    </div>
  );
}
