'use client';

import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
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
  requestId: string;
  lastNudgedAt: Date | null;
};

export function NudgeButton({ requestId, lastNudgedAt }: Props) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);

  const daysSinceNudge = lastNudgedAt
    ? (Date.now() - new Date(lastNudgedAt).getTime()) / (1000 * 60 * 60 * 24)
    : NUDGE_COOLDOWN_DAYS;
  const canNudge = daysSinceNudge >= NUDGE_COOLDOWN_DAYS;
  const daysRemaining = Math.ceil(NUDGE_COOLDOWN_DAYS - daysSinceNudge);

  async function handleNudge() {
    setIsPending(true);
    try {
      const res = await fetch(`/api/mentorship-requests/${requestId}/nudge`, {
        method: 'POST'
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message ?? 'Something went wrong');
        return;
      }

      toast.success('Nudge sent!');
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsPending(false);
      setOpen(false);
    }
  }

  if (!canNudge) {
    return (
      <Button size="icon" variant="outline" disabled className="text-xs w-fit px-2">
        <Bell className="size-3.5" />
        Nudged {daysRemaining}d ago
      </Button>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="outline" className="text-xs w-fit px-2">
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
            This will send your mentee an email letting them know you think you&apos;re a great match and encouraging
            them to book a session with you.
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
