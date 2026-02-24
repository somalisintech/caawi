'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export const SignOutMenuButton = () => {
  const router = useRouter();
  const supabase = createClient();
  return (
    <button
      type="button"
      onClick={async () => {
        await supabase.auth.signOut();
        router.push('/auth');
      }}
    >
      Sign out
    </button>
  );
};
