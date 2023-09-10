'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function LoginButton() {
  const session = useSession();
  if (session.data)
    return (
      <Button variant={'ghost'} size={'lg'} onClick={() => signOut()}>
        Logout
      </Button>
    );

  return (
    <>
      <Button variant={'ghost'} size={'lg'} onClick={() => signIn('github')}>
        GitHub
      </Button>
      <Button variant={'ghost'} size={'lg'} onClick={() => signIn('google')}>
        Google
      </Button>
    </>
  );
}
