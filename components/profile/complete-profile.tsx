'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CompleteProfileForm } from './forms';
import { UserWithProfile } from '@/types/user';

type Props = {
  user: UserWithProfile;
};

export function CompleteProfile({ user }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user.firstName || !user.lastName || !user.email || !user.profile?.gender) {
      setOpen(true);
    }
  }, [user]);

  return (
    <Dialog open={open}>
      <DialogContent className="hide-dialog-close">
        <DialogHeader>
          <DialogTitle>Complete your profile</DialogTitle>
          <DialogDescription>Tell us a little more about yourself.</DialogDescription>
        </DialogHeader>
        <CompleteProfileForm user={user} onComplete={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
