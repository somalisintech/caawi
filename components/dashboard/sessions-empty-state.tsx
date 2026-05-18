'use client';

import { CalendarDays, Search, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Props = {
  userType: 'MENTOR' | 'MENTEE';
  hasCalendly: boolean;
  hasMentors?: boolean;
};

export function EmptyState({ userType, hasCalendly, hasMentors = false }: Props) {
  if (userType === 'MENTOR' && !hasCalendly) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-muted/20 px-8 py-16 text-center dark:bg-zinc-900/20">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 dark:bg-primary/20">
          <CalendarDays className="size-7 text-primary" />
        </div>
        <h3 className="mt-5 text-balance text-[18px] font-semibold text-foreground">Connect Calendly to get started</h3>
        <p className="mt-2 max-w-sm text-pretty text-[14px] leading-relaxed text-muted-foreground">
          Once connected, mentees can discover your profile and book sessions directly.
        </p>
        <Button asChild className="mt-6">
          <Link href="/dashboard/profile">Connect Calendly</Link>
        </Button>
      </div>
    );
  }

  if (userType === 'MENTEE') {
    if (hasMentors) {
      return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-muted/20 px-8 py-16 text-center dark:bg-zinc-900/20">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 dark:bg-primary/20">
            <Users className="size-7 text-primary" />
          </div>
          <h3 className="mt-5 text-balance text-[18px] font-semibold text-foreground">
            Book a session with your mentor
          </h3>
          <p className="mt-2 max-w-sm text-pretty text-[14px] leading-relaxed text-muted-foreground">
            Pick a mentor and schedule a time that works for you.
          </p>
          <Button asChild className="mt-6">
            <Link href="/dashboard/mentors">View your mentors</Link>
          </Button>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-muted/20 px-8 py-16 text-center dark:bg-zinc-900/20">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 dark:bg-primary/20">
          <Search className="size-7 text-primary" />
        </div>
        <h3 className="mt-5 text-balance text-[18px] font-semibold text-foreground">Book your first session</h3>
        <p className="mt-2 max-w-sm text-pretty text-[14px] leading-relaxed text-muted-foreground">
          Browse our mentors and schedule a time that works for you.
        </p>
        <Button asChild className="mt-6">
          <Link href="/dashboard/browse-mentors">Find a mentor</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-muted/20 px-8 py-16 text-center dark:bg-zinc-900/20">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 dark:bg-primary/20">
        <CalendarDays className="size-7 text-primary" />
      </div>
      <h3 className="mt-5 text-balance text-[18px] font-semibold text-foreground">No sessions yet</h3>
      <p className="mt-2 max-w-sm text-pretty text-[14px] leading-relaxed text-muted-foreground">
        Share your profile so mentees can book time with you.
      </p>
    </div>
  );
}
