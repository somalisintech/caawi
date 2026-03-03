'use client';

import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const NUDGE_COOLDOWN_DAYS = 7;

type Props = {
  requestId: string;
  lastNudgedAt: Date | null;
};

export function NudgeButton({ requestId, lastNudgedAt }: Props) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

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
    }
  }

  if (!canNudge) {
    return (
      <Button size="sm" variant="outline" disabled className="gap-1">
        <Bell className="size-3.5" />
        Nudged {daysRemaining}d ago
      </Button>
    );
  }

  return (
    <Button size="sm" variant="outline" disabled={isPending} onClick={handleNudge} className="gap-1">
      <Bell className="size-3.5" />
      {isPending ? 'Sending...' : 'Nudge'}
    </Button>
  );
}
