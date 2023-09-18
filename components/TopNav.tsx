import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { SignOutButton } from '@/components/SignOutButton';

export default async function TopNav() {
  const session = await getServerSession(authOptions);

  if (session) {
    const initials = session?.user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('');

    return (
      <div className="ml-auto mr-5 mt-5 flex space-x-2">
        <Avatar>
          <AvatarImage src={session?.user?.image!} alt={session?.user?.name!} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <SignOutButton />
      </div>
    );
  }

  return (
    <div className="ml-auto mr-5 mt-5 flex space-x-2">
      <Link href={'/login'}>
        <Button variant="outline">Sign in</Button>
      </Link>
      <Link href={'/register'}>
        <Button>Sign up</Button>
      </Link>
    </div>
  );
}
