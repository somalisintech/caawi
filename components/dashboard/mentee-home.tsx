import { Search } from 'lucide-react';
import Link from 'next/link';
import LayerCard from '@/components/layer-card';
import { Button } from '@/components/ui/button';
import { LocalTime } from './local-time';
import { SessionListItem } from './session-list-item';

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

export function MenteeHome({ firstName, mentorCount, upcomingSessions, totalSessions, recentSessions }: Props) {
  const greeting = firstName ? `Welcome back, ${firstName}` : 'Welcome back';
  const nextSession = upcomingSessions[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-balance text-3xl font-bold text-foreground md:text-4xl">{greeting}</h1>
        <p className="mt-2 max-w-[600px] text-pretty text-base text-muted-foreground">
          Find a mentor who can help you grow and book a session.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <LayerCard>
          <LayerCard.Secondary>
            <span>Upcoming sessions</span>
          </LayerCard.Secondary>
          <LayerCard.Primary>
            <p className="text-2xl font-semibold tabular-nums text-foreground">{upcomingSessions.length}</p>
          </LayerCard.Primary>
        </LayerCard>
        <LayerCard>
          <LayerCard.Secondary>
            <span>Mentors available</span>
          </LayerCard.Secondary>
          <LayerCard.Primary>
            <p className="text-2xl font-semibold tabular-nums text-foreground">{mentorCount}</p>
          </LayerCard.Primary>
        </LayerCard>
        <LayerCard>
          <LayerCard.Secondary>
            <span>Completed sessions</span>
          </LayerCard.Secondary>
          <LayerCard.Primary>
            <p className="text-2xl font-semibold tabular-nums text-foreground">{totalSessions}</p>
          </LayerCard.Primary>
        </LayerCard>
        <LayerCard>
          <LayerCard.Secondary>
            <span>Next session</span>
          </LayerCard.Secondary>
          <LayerCard.Primary>
            {nextSession ? (
              <LocalTime
                date={nextSession.startTime}
                format="datetime"
                className="block text-sm font-medium text-foreground"
              />
            ) : (
              <p className="text-sm font-medium text-muted-foreground">None scheduled</p>
            )}
          </LayerCard.Primary>
          {nextSession && (
            <LayerCard.Secondary>
              <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                with {nextSession.mentorProfile.user.firstName ?? 'Mentor'}
              </p>
            </LayerCard.Secondary>
          )}
        </LayerCard>
      </div>

      {/* Find a mentor CTA */}
      <LayerCard>
        <LayerCard.Primary className="p-6 md:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Search className="size-5 text-muted-foreground" />
              <div>
                <p className="font-semibold text-foreground">{mentorCount} mentors available</p>
                <p className="mt-0.5 text-sm text-muted-foreground">Search by name, skill, or country.</p>
              </div>
            </div>
            <Button
              asChild
              className="h-11 shrink-0 rounded-lg bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/dashboard/mentors">Find a mentor</Link>
            </Button>
          </div>
        </LayerCard.Primary>
      </LayerCard>

      {/* Upcoming sessions list */}
      {upcomingSessions.length > 0 ? (
        <LayerCard>
          <LayerCard.Secondary>Upcoming sessions</LayerCard.Secondary>
          <LayerCard.Primary className="p-0">
            <div className="divide-y divide-border">
              {upcomingSessions.map((session) => (
                <SessionListItem key={session.id} session={session} otherUser={session.mentorProfile.user} />
              ))}
            </div>
          </LayerCard.Primary>
        </LayerCard>
      ) : (
        <LayerCard>
          <LayerCard.Secondary>Upcoming sessions</LayerCard.Secondary>
          <LayerCard.Primary className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No upcoming sessions yet. Browse mentors and book your first session.
            </p>
          </LayerCard.Primary>
        </LayerCard>
      )}

      {/* Recent sessions */}
      {recentSessions.length > 0 && (
        <LayerCard>
          <LayerCard.Secondary>Recent sessions</LayerCard.Secondary>
          <LayerCard.Primary className="p-0">
            <div className="divide-y divide-border">
              {recentSessions.map((session) => (
                <SessionListItem key={session.id} session={session} otherUser={session.mentorProfile.user} isRecent />
              ))}
            </div>
          </LayerCard.Primary>
        </LayerCard>
      )}
    </div>
  );
}
