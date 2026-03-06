'use client';

import { MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getFullName, getInitials } from '../session-list-item';
import { FeedbackForm } from './feedback-form';

type AwaitingSession = {
  id: string;
  eventName: string | null;
  endTime: string;
  counterpart: { firstName: string | null; lastName: string | null; image: string | null };
};

type Props = {
  sessions: AwaitingSession[];
};

export function FeedbackPrompt({ sessions }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (sessions.length === 0) return null;

  return (
    <>
      <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
        <div className="flex items-center gap-2 text-[13px] font-medium text-amber-800 dark:text-amber-300">
          <MessageSquare className="size-4" />
          {sessions.length === 1 ? 'Rate your recent session' : `Rate ${sessions.length} recent sessions`}
        </div>
        <div className="mt-3 space-y-2">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-2.5 dark:bg-zinc-900/40"
            >
              <div className="flex items-center gap-2.5">
                <Avatar className="size-7">
                  <AvatarImage src={s.counterpart.image ?? undefined} />
                  <AvatarFallback className="text-[10px]">
                    {getInitials(s.counterpart.firstName, s.counterpart.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[13px] font-medium text-foreground">{s.eventName ?? 'Mentoring Session'}</p>
                  <p className="text-[11px] text-muted-foreground">
                    with {getFullName(s.counterpart.firstName, s.counterpart.lastName)}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-[12px]" onClick={() => setSelectedId(s.id)}>
                Rate
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Session Feedback</DialogTitle>
          </DialogHeader>
          {selectedId && <FeedbackForm sessionId={selectedId} onSuccess={() => setSelectedId(null)} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
