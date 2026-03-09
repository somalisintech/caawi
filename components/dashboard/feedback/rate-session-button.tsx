'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FeedbackForm } from './feedback-form';

type Props = {
  sessionId: string;
};

export function RateSessionButton({ sessionId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" className="gap-1.5 text-[12px]" onClick={() => setOpen(true)}>
        Rate
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Session Feedback</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <FeedbackForm sessionId={sessionId} onSuccess={() => setOpen(false)} />
          </DialogBody>
          <DialogFooter className="px-4 py-3">
            <p className="text-center text-xs text-muted-foreground">
              Ratings are blind for 5 days, neither party sees the other&apos;s feedback until then.
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
