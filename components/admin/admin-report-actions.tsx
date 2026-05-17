'use client';

import { Ban, Check, X } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { banAndCloseReportAction, updateReportStatusAction } from '@/app/actions/admin';
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
  reportId: string;
  reportedUserName: string;
  reportedUserIsBanned: boolean;
};

type Decision = null | 'review' | 'dismiss' | 'action';

export function AdminReportActions({ reportId, reportedUserName, reportedUserIsBanned }: Props) {
  const [isPending, startTransition] = useTransition();
  const [decision, setDecision] = useState<Decision>(null);

  function handleOpenChange(next: boolean) {
    if (isPending) return;
    if (!next) setDecision(null);
  }

  function handleConfirm() {
    if (!decision) return;
    startTransition(async () => {
      let result: { success: boolean; message: string };
      if (decision === 'review') {
        result = await updateReportStatusAction({ reportId, status: 'REVIEWED' });
      } else if (decision === 'dismiss') {
        result = await updateReportStatusAction({ reportId, status: 'DISMISSED' });
      } else {
        result = await banAndCloseReportAction({ reportId });
      }
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      setDecision(null);
    });
  }

  const copy = (() => {
    if (decision === 'review') {
      return {
        title: 'Mark this report as reviewed?',
        body: `Marks the report as reviewed without further action. ${reportedUserName} will not be affected.`,
        cta: 'Mark reviewed'
      };
    }
    if (decision === 'dismiss') {
      return {
        title: 'Dismiss this report?',
        body: `Closes the report with no action against ${reportedUserName}.`,
        cta: 'Dismiss'
      };
    }
    if (decision === 'action') {
      return {
        title: `Ban ${reportedUserName} and close the report?`,
        body: reportedUserIsBanned
          ? `${reportedUserName} is already banned. The report will be closed as actioned.`
          : `${reportedUserName} will be marked as banned and the report will be closed as actioned.`,
        cta: 'Ban and close'
      };
    }
    return null;
  })();

  return (
    <AlertDialog open={decision !== null} onOpenChange={handleOpenChange}>
      <div className="flex flex-wrap gap-2">
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            className="gap-1.5 px-2 text-xs"
            onClick={() => setDecision('review')}
          >
            <Check className="size-3.5" />
            Review
          </Button>
        </AlertDialogTrigger>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            className="gap-1.5 px-2 text-xs"
            onClick={() => setDecision('dismiss')}
          >
            <X className="size-3.5" />
            Dismiss
          </Button>
        </AlertDialogTrigger>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            className="gap-1.5 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setDecision('action')}
          >
            <Ban className="size-3.5" />
            Ban &amp; close
          </Button>
        </AlertDialogTrigger>
      </div>
      {copy && (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{copy.title}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogBody>
            <AlertDialogDescription>{copy.body}</AlertDialogDescription>
          </AlertDialogBody>
          <AlertDialogFooter className="px-3 py-2">
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
              {isPending ? 'Working...' : copy.cta}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
}
