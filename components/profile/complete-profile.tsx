'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CompleteProfileForm } from './forms';
import { Profile, User } from '@prisma/client';

type Props = {
  user: Partial<User & { profile: Partial<Profile> }>;
};

export function CompleteProfile({ user }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user.profile?.isComplete) {
      setOpen(true);
    }
  }, [user]);

  return (
    <Dialog open={open}>
      <DialogContent className="hide-dialog-close">
        <DialogHeader>
          <DialogTitle>Complete your profile</DialogTitle>
          <DialogDescription>Tell us a little more about yourself.</DialogDescription>
          <CompleteProfileForm user={user} onComplete={() => setOpen(false)} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
