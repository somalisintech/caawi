'use client';

import { Bell } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { browseNudgeAction } from '@/app/actions/mentees';
import { Button } from '@/components/ui/button';

const NUDGE_COOLDOWN_DAYS = 7;

type Props = {
  menteeProfileId: string;
  lastNudgedAt: Date | null;
};

export function BrowseNudgeButton({ menteeProfileId, lastNudgedAt }: Props) {
  const [isPending, startTransition] = useTransition();

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
        return;
      }
      toast.success(result.message);
    });
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
