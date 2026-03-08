'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { submitSessionFeedbackAction } from '@/app/actions/feedback';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from './star-rating';

type Props = {
  sessionId: string;
  onSuccess?: () => void;
};

export function FeedbackForm({ sessionId, onSuccess }: Props) {
  const router = useRouter();
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (stars === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsPending(true);
    try {
      const result = await submitSessionFeedbackAction({
        sessionId,
        stars,
        comment: comment.trim() || undefined
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success('Feedback submitted!');
      router.refresh();
      onSuccess?.();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <span className="text-[13px] font-medium text-foreground">How was your session?</span>
        <StarRating value={stars} onChange={setStars} />
      </div>
      <div className="space-y-2">
        <label htmlFor="feedback-comment" className="text-[13px] font-medium text-foreground">
          Comments <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <Textarea
          id="feedback-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about the session..."
          maxLength={500}
          rows={3}
          className="resize-none text-[14px]"
        />
        <p className="text-right text-[11px] tabular-nums text-muted-foreground">{comment.length}/500</p>
      </div>
      <Button type="submit" disabled={isPending || stars === 0} className="w-full">
        {isPending ? 'Submitting...' : 'Submit Feedback'}
      </Button>
      <p className="text-center text-[12px] text-muted-foreground">
        Ratings are blind for 5 days, neither party sees the other&apos;s feedback until then.
      </p>
    </form>
  );
}
