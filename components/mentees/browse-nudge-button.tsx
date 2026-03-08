'use client';

import { Bell } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { browseNudgeAction } from '@/app/actions/mentees';
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

const NUDGE_COOLDOWN_DAYS = 7;

type Props = {
  menteeProfileId: string;
  lastNudgedAt: Date | null;
};

export function BrowseNudgeButton({ menteeProfileId, lastNudgedAt }: Props) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const daysSinceNudge = lastNudgedAt
    ? (Date.now() - new Date(lastNudgedAt).getTime()) / (1000 * 60 * 60 * 24)
    : NUDGE_COOLDOWN_DAYS;
  const canNudge = daysSinceNudge >= NUDGE_COOLDOWN_DAYS;
  const daysRemaining = Math.ceil(NUDGE_COOLDOWN_DAYS - daysSinceNudge);

  function handleNudge() {
    startTransition(async () => {
      const result = await browseNudgeAction(menteeProfileId);
      if (!result.success) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
      }
      setOpen(false);
    });
  }

  if (!canNudge) {
    return (
      <Button size="sm" variant="outline" disabled className="text-xs gap-1 font-mono uppercase w-fit px-2">
        <Bell className="size-3.5" />
        Nudged {daysRemaining}d ago
      </Button>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-xs gap-1 font-mono uppercase w-fit px-2">
          <Bell className="size-3.5" />
          Nudge
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Send a nudge?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogBody>
          <AlertDialogDescription>
            This will send this mentee an email letting them know you think you&apos;re a great match and encouraging
            them to get in touch with you.
          </AlertDialogDescription>
        </AlertDialogBody>
        <AlertDialogFooter className="px-3 py-2">
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleNudge} disabled={isPending}>
            {isPending ? 'Sending...' : 'Send nudge'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
