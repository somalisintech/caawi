'use client';

import { signOut } from 'next-auth/react';

export const SignOutMenuButton = () => (
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
