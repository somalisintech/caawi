'use client';

import { Clock, Eye, EyeOff, MessageSquare } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { getSessionFeedbackAction } from '@/app/actions/feedback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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

const loadFeedback = useCallback(async () => {
  try {
    const result = await getSessionFeedbackAction(sessionId);
    if (result.success && result.data) {
      setFeedback(result.data);
    }
  } finally {
    setLoading(false);
  }
}, [sessionId]);

  useEffect(() => {
    loadFeedback();
  }, [loadFeedback]);

  const sessionEnded = new Date(sessionEndTime) < new Date();

  if (isCanceled || !sessionEnded || loading) return null;

  // User hasn't submitted feedback yet — show CTA
  if (!feedback?.myFeedback) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full gap-2 text-[13px]">
            <MessageSquare className="size-3.5" />
            Rate this session
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Session Feedback</DialogTitle>
          </DialogHeader>
          <FeedbackForm sessionId={sessionId} onSuccess={loadFeedback} />
        </DialogContent>
      </Dialog>
    );
  }

  // User has submitted — show their feedback + other party status
  const windowClosed = feedback.windowClosesAt ? new Date() >= new Date(feedback.windowClosesAt) : false;

  return (
    <div className="space-y-3 rounded-md border border-border/60 bg-muted/20 p-4 dark:bg-zinc-900/30">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-foreground">Your rating</p>
        <StarRating value={feedback.myFeedback.stars} readonly size="sm" />
      </div>
      {feedback.myFeedback.comment ? (
        <p className="text-[13px] text-muted-foreground">&ldquo;{feedback.myFeedback.comment}&rdquo;</p>
      ) : null}

      {/* Other party's feedback */}
      {feedback.otherFeedback && windowClosed ? (
        <div className="border-t border-border/40 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Eye className="size-3.5 text-muted-foreground" />
              <p className="text-[13px] font-medium text-foreground">Their rating</p>
            </div>
            <StarRating value={feedback.otherFeedback.stars} readonly size="sm" />
          </div>
          {feedback.otherFeedback.comment ? (
            <p className="mt-1.5 text-[13px] text-muted-foreground">&ldquo;{feedback.otherFeedback.comment}&rdquo;</p>
          ) : null}
        </div>
      ) : feedback.hasOtherSubmitted && !windowClosed ? (
        <div className="flex items-center gap-1.5 border-t border-border/40 pt-3">
          <EyeOff className="size-3.5 text-muted-foreground" />
          <p className="text-[12px] text-muted-foreground">
            Other party rated — visible after{' '}
            {feedback.windowClosesAt
              ? new Date(feedback.windowClosesAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric'
                })
              : 'blind window closes'}
          </p>
        </div>
      ) : !feedback.hasOtherSubmitted ? (
        <div className="flex items-center gap-1.5 border-t border-border/40 pt-3">
          <Clock className="size-3.5 text-muted-foreground" />
          <Badge variant="outline" className="text-[11px] font-normal text-muted-foreground">
            Awaiting other party&apos;s feedback
          </Badge>
        </div>
      ) : null}
    </div>
  );
}
