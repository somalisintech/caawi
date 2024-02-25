'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CompleteProfileForm } from './forms';

export function CompleteProfile() {
  const { data } = useSession();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (data && !data.user.isComplete) {
      setOpen(true);
    }
  }, [data]);

  return (
    <Dialog open={open}>
      <DialogContent className="hide-dialog-close">
        <DialogHeader>
          <DialogTitle>Complete your profile</DialogTitle>
          <DialogDescription>Tell us a little more about yourself.</DialogDescription>
          {data?.user && <CompleteProfileForm user={data.user} onComplete={() => setOpen(false)} />}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
