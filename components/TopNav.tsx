'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function TopNav() {
  const { status, data: session } = useSession();

  switch (status) {
    case 'authenticated':
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
          <Button onClick={() => signOut({ redirect: false }).then(() => toast({ title: 'Goodbye 👋🏾' }))}>
            Sign out
          </Button>
        </div>
      );
    case 'unauthenticated':
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
    default:
      return null;
  }
}
