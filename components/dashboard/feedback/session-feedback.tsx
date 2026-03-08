'use client';

import { Clock, Eye, EyeOff, MessageSquare } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { getSessionFeedbackAction } from '@/app/actions/feedback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { FeedbackForm } from './feedback-form';
import { StarRating } from './star-rating';

type FeedbackData = {
  myFeedback: { stars: number; comment: string | null; submittedAt: string } | null;
  otherFeedback: { stars: number; comment: string | null; submittedAt: string } | null;
  windowClosesAt: string | null;
  hasOtherSubmitted: boolean;
};

type Props = {
  sessionId: string;
  sessionEndTime: string;
  isCanceled: boolean;
};

export function SessionFeedback({ sessionId, sessionEndTime, isCanceled }: Props) {
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const loadFeedback = useCallback(async () => {
    try {
      const result = await getSessionFeedbackAction(sessionId);
      if (result.success && result.data) {
        setFeedback(result.data);
      } else {
        setFetchError(true);
      }
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadFeedback();
  }, [loadFeedback]);

  const sessionEnded = new Date(sessionEndTime) < new Date();

  if (loading || fetchError) return null;
  if (isCanceled || !sessionEnded) return null;

  // User hasn't submitted yet — show rating CTA
  if (!feedback?.myFeedback) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-[12px]">
            <MessageSquare className="size-3.5" />
            Rate this session
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Session Feedback</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <FeedbackForm sessionId={sessionId} onSuccess={loadFeedback} />
          </DialogBody>
          <DialogFooter className="px-4 py-3">
            <p className="text-center text-xs text-muted-foreground">
              Ratings are blind for 5 days, neither party sees the other&apos;s feedback until then.
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return feedback.otherFeedback ? (
    <div className="border-t border-border/40 pt-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Eye className="size-3.5 text-muted-foreground" />
          <p className="text-[13px] font-medium text-foreground">Their rating</p>
        </div>
        <StarRating value={feedback.otherFeedback.stars} readonly size="md" />
      </div>
      {feedback.otherFeedback.comment ? (
        <p className="mt-1.5 text-[13px] text-muted-foreground">&ldquo;{feedback.otherFeedback.comment}&rdquo;</p>
      ) : null}
    </div>
  ) : feedback.hasOtherSubmitted && feedback.windowClosesAt && new Date() < new Date(feedback.windowClosesAt) ? (
    <div className="flex items-center gap-1.5 border-t border-border/40 pt-3">
      <EyeOff className="size-3.5 text-muted-foreground" />
      <p className="text-[12px] text-muted-foreground">
        Other party rated — visible after{' '}
        {new Date(feedback.windowClosesAt).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric'
        })}
      </p>
    </div>
  ) : !feedback.hasOtherSubmitted ? (
    <div className="flex items-center gap-1.5 border-t border-border/40 pt-3">
      <Clock className="size-3.5 text-muted-foreground" />
      <Badge variant="outline" className="text-[11px] font-normal text-muted-foreground">
        Awaiting other party&apos;s feedback
      </Badge>
    </div>
  ) : null;
}
