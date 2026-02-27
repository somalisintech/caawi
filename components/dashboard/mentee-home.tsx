import { BarChart3, Calendar, Clock, Search, Users } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LocalTime } from './local-time';
import { RelativeBadge } from './relative-badge';

type SessionItem = {
  id: string;
  eventName: string | null;
  startTime: Date;
  endTime: Date;
  mentorProfile: {
    user: {
      firstName: string | null;
      lastName: string | null;
      image: string | null;
    };
  };
};

type Props = {
  firstName?: string | null;
  mentorCount: number;
  upcomingSessions: SessionItem[];
  totalSessions: number;
  recentSessions: SessionItem[];
};

function getInitials(firstName: string | null, lastName: string | null) {
  return [firstName?.[0], lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?';
}

export function MenteeHome({ firstName, mentorCount, upcomingSessions, totalSessions, recentSessions }: Props) {
  const greeting = firstName ? `Welcome back, ${firstName}` : 'Welcome back';
  const nextSession = upcomingSessions[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#111] md:text-4xl md:leading-[44px] dark:text-zinc-100">
          {greeting}
        </h1>
        <p className="mt-2 max-w-[600px] text-base text-[#666] dark:text-zinc-400">
          Find a mentor who can help you grow and book a session.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <span>Mentors available</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#111] dark:text-zinc-100">{mentorCount}</p>
        </div>
        <div className="rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 text-sm text-[#777] dark:text-zinc-400">
            <BarChart3 className="size-4" />
            <span>Completed sessions</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#111] dark:text-zinc-100">{totalSessions}</p>
        </div>
        <div className="rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 text-sm text-[#777] dark:text-zinc-400">
            <Clock className="size-4" />
            <span>Next session</span>
          </div>
          {nextSession ? (
            <>
              <LocalTime
                date={nextSession.startTime}
                format="datetime"
                className="mt-2 block text-sm font-semibold text-[#111] dark:text-zinc-100"
              />
              <p className="mt-0.5 text-sm text-[#777] dark:text-zinc-400">
                with {nextSession.mentorProfile.user.firstName ?? 'Mentor'}
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm font-semibold text-[#777] dark:text-zinc-400">None scheduled</p>
          )}
        </div>
      </div>

      {/* Find a mentor CTA */}
      <div className="rounded-xl border border-border p-6 md:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Search className="size-5 text-[#777] dark:text-zinc-500" />
            <div>
              <p className="font-semibold text-[#111] dark:text-zinc-100">{mentorCount} mentors available</p>
              <p className="mt-0.5 text-sm text-[#777] dark:text-zinc-400">Search by name, skill, or country.</p>
            </div>
          </div>
          <Button
            asChild
            className="h-11 shrink-0 rounded-lg bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/dashboard/mentors">Find a mentor</Link>
          </Button>
        </div>
      </div>

      {/* Upcoming sessions list */}
      {upcomingSessions.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-[#111] dark:text-zinc-100">Upcoming sessions</h2>
          <div className="divide-y divide-border rounded-xl border border-border">
            {upcomingSessions.map((session) => {
              const { user } = session.mentorProfile;
              return (
                <div key={session.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.image ?? undefined} />
                      <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-[#111] dark:text-zinc-100">
                        {session.eventName ?? 'Mentoring Session'}
                      </p>
                      <p className="mt-0.5 text-sm text-[#777] dark:text-zinc-400">
                        with {user.firstName} {user.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <RelativeBadge date={session.startTime} />
                    <div className="text-right">
                      <LocalTime
                        date={session.startTime}
                        format="date"
                        className="block text-sm font-medium text-[#111] dark:text-zinc-100"
                      />
                      <p className="mt-0.5 text-sm text-[#777] dark:text-zinc-400">
                        <LocalTime date={session.startTime} format="time" />
                        {' – '}
                        <LocalTime date={session.endTime} format="time" />
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-[#111] dark:text-zinc-100">Upcoming sessions</h2>
          <div className="rounded-xl border border-border p-8 text-center">
            <p className="text-sm text-[#777] dark:text-zinc-400">
              No upcoming sessions yet. Browse mentors and book your first session.
            </p>
          </div>
        </div>
      )}

      {/* Recent sessions */}
      {recentSessions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-[#111] dark:text-zinc-100">Recent sessions</h2>
          <div className="divide-y divide-border rounded-xl border border-border">
            {recentSessions.map((session) => {
              const { user } = session.mentorProfile;
              return (
                <div key={session.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.image ?? undefined} />
                      <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-[#777] dark:text-zinc-400">
                        {session.eventName ?? 'Mentoring Session'}
                      </p>
                      <p className="mt-0.5 text-sm text-[#777] dark:text-zinc-500">
                        with {user.firstName} {user.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <LocalTime
                      date={session.startTime}
                      format="date"
                      className="block text-sm font-medium text-[#777] dark:text-zinc-400"
                    />
                    <p className="mt-0.5 text-sm text-[#777] dark:text-zinc-500">
                      <LocalTime date={session.startTime} format="time" />
                      {' – '}
                      <LocalTime date={session.endTime} format="time" />
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
