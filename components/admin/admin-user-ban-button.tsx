'use client';

import { Ban, RotateCcw } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { banUserAction, unbanUserAction } from '@/app/actions/admin';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

type Props = {
  userId: string;
  userName: string;
  isBanned: boolean;
  isAdmin: boolean;
};

export function AdminUserBanButton({ userId, userName, isBanned, isAdmin }: Props) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  function handleOpenChange(next: boolean) {
    if (isPending) return;
    setOpen(next);
  }

  function handleConfirm() {
    startTransition(async () => {
      const result = isBanned ? await unbanUserAction({ userId }) : await banUserAction({ userId });
      if (result.success) {
        if (result.idempotent) {
          toast.info(result.message);
        } else {
          toast.success(result.message);
        }
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  }

  if (isAdmin) {
    return (
      <Button size="sm" variant="outline" disabled className="gap-1.5 px-2 text-xs">
        Protected
      </Button>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className={
            isBanned
              ? 'gap-1.5 px-2 text-xs'
              : 'gap-1.5 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive'
          }
        >
          {isBanned ? <RotateCcw className="size-3.5" /> : <Ban className="size-3.5" />}
          {isBanned ? 'Unban' : 'Ban'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{isBanned ? 'Unban this user?' : 'Ban this user?'}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogBody>
          <AlertDialogDescription>
            {isBanned
              ? `${userName} will regain access to the platform.`
              : `${userName} will be marked as banned. Their account is preserved and can be restored later.`}
          </AlertDialogDescription>
        </AlertDialogBody>
        <AlertDialogFooter className="px-3 py-2">
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
            {isPending ? 'Working...' : isBanned ? 'Unban user' : 'Ban user'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
