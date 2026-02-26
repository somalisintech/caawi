import { Calendar, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type SessionItem = {
  id: string;
  eventName: string | null;
  startTime: Date;
  endTime: Date;
  menteeProfile: {
    user: {
      firstName: string | null;
      lastName: string | null;
      image: string | null;
    };
  };
};

type Props = {
  firstName?: string | null;
  hasCalendly: boolean;
  upcomingSessions: SessionItem[];
  menteeCount: number;
};

export function MentorHome({ firstName, hasCalendly, upcomingSessions, menteeCount }: Props) {
  const greeting = firstName ? `Welcome back, ${firstName}` : 'Welcome back';
  const nextSession = upcomingSessions[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#111] md:text-4xl md:leading-[44px] dark:text-zinc-100">
          {greeting}
        </h1>
        <p className="mt-2 max-w-[600px] text-base text-[#666] dark:text-zinc-400">
          Mentees discover you through the directory and book sessions via Calendly.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 text-sm text-[#777] dark:text-zinc-400">
            <Calendar className="size-4" />
            <span>Upcoming sessions</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#111] dark:text-zinc-100">{upcomingSessions.length}</p>
        </div>
        <div className="rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 text-sm text-[#777] dark:text-zinc-400">
            <Users className="size-4" />
            <span>Unique mentees</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#111] dark:text-zinc-100">{menteeCount}</p>
        </div>
        {nextSession && (
          <div className="rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 text-sm text-[#777] dark:text-zinc-400">
              <Clock className="size-4" />
              <span>Next session</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-[#111] dark:text-zinc-100">
              {new Date(nextSession.startTime).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </p>
            <p className="mt-0.5 text-sm text-[#777] dark:text-zinc-400">
              with {nextSession.menteeProfile.user.firstName ?? 'Mentee'}
            </p>
          </div>
        )}
      </div>

      {/* Primary block — profile completeness / next step */}
      <div className="rounded-xl border border-border p-6 md:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Users className="size-5 text-[#777] dark:text-zinc-500" />
            <div>
              <p className="font-semibold text-[#111] dark:text-zinc-100">Your mentor profile is live</p>
              <p className="mt-0.5 text-sm text-[#777] dark:text-zinc-400">
                {hasCalendly
                  ? 'Mentees can find you and book sessions.'
                  : 'Connect Calendly so mentees can book time with you.'}
              </p>
            </div>
          </div>
          <Button
            asChild
            className="h-11 shrink-0 rounded-lg bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Link href={hasCalendly ? '/dashboard/mentors' : '/dashboard/profile'}>
              {hasCalendly ? 'Browse mentors' : 'Connect Calendly'}
            </Link>
          </Button>
        </div>
      </div>

      {/* Upcoming sessions list */}
      {upcomingSessions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-[#111] dark:text-zinc-100">Upcoming sessions</h2>
          <div className="divide-y divide-border rounded-xl border border-border">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-[#111] dark:text-zinc-100">
                    {session.eventName ?? 'Mentoring Session'}
                  </p>
                  <p className="mt-0.5 text-sm text-[#777] dark:text-zinc-400">
                    with {session.menteeProfile.user.firstName} {session.menteeProfile.user.lastName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#111] dark:text-zinc-100">
                    {new Date(session.startTime).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="mt-0.5 text-sm text-[#777] dark:text-zinc-400">
                    {new Date(session.startTime).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                    {' – '}
                    {new Date(session.endTime).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
