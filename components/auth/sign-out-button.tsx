'use client';

import { signOut } from 'next-auth/react';

export const SignOutButton = () => (
  <div
    role="button"
    onClick={() =>
      signOut({
        callbackUrl: '/'
      })
    }
  >
    Sign out
  </div>
);
