'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export const SignOutMenuButton = () => {
  const router = useRouter();
  const supabase = createClient();
  return (
    <div
      role="button"
      onClick={() => {
        supabase.auth.signOut();
        router.refresh();
      }}
    >
      Sign out
    </div>
  );
};
