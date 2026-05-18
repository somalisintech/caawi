'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';

type Status = 'pending' | 'signed_out' | 'error' | 'navigating';

export function SignOutTrigger() {
  const [status, setStatus] = useState<Status>('pending');

  const runSignOut = useCallback(() => {
    setStatus('pending');
    const supabase = createClient();
    supabase.auth
      .signOut()
      .then(({ error }) => {
        setStatus(error ? 'error' : 'signed_out');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => {
    runSignOut();
  }, [runSignOut]);

  function handleClick() {
    if (status === 'error') {
      runSignOut();
      return;
    }
    setStatus('navigating');
    window.location.href = '/';
  }

  const label =
    status === 'pending'
      ? 'Signing out…'
      : status === 'error'
        ? 'Sign-out failed — retry'
        : status === 'navigating'
          ? 'Redirecting…'
          : 'Return to homepage';

  return (
    <Button
      onClick={handleClick}
      disabled={status === 'pending' || status === 'navigating'}
      variant={status === 'error' ? 'outline' : 'default'}
      className="w-fit"
    >
      {label}
    </Button>
  );
}
