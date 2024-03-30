'use client';

import { createClient } from '@/utils/supabase/client';

export const SignOutMenuButton = () => {
  const supabase = createClient();
  return (
    <div role="button" onClick={() => supabase.auth.signOut()}>
      Sign out
    </div>
  );
};
