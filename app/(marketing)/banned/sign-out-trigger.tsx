'use client';

import { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';

export function SignOutTrigger() {
  const [isPending, startTransition] = useTransition();
  const [signedOut, setSignedOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.signOut().finally(() => setSignedOut(true));
  }, []);

  function handleClick() {
    startTransition(() => {
      window.location.href = '/';
    });
  }

  return (
    <Button onClick={handleClick} disabled={isPending} className="w-fit">
      {signedOut ? 'Return to homepage' : 'Signing out…'}
    </Button>
  );
}
