import { Users } from 'lucide-react';
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
  totalSessions: number;
  recentSessions: SessionItem[];
};

function getInitials(firstName: string | null, lastName: string | null) {
  return [firstName?.[0], lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?';
}

function getFullName(firstName: string | null, lastName: string | null) {
  return [firstName, lastName].filter(Boolean).join(' ') || 'Mentee';
}

export function MentorHome({
  firstName,
  hasCalendly,
  upcomingSessions,
  menteeCount,
  totalSessions,
  recentSessions
}: Props) {
  const greeting = firstName ? `Welcome back, ${firstName}` : 'Welcome back';
  const nextSession = upcomingSessions[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-balance text-3xl font-bold text-foreground md:text-4xl">{greeting}</h1>
        <p className="mt-2 max-w-[600px] text-pretty text-base text-muted-foreground">
          Mentees discover you through the directory and book sessions via Calendly.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <LayerCard>
          <LayerCard.Secondary>
            <Calendar className="size-4" />
            <span>Upcoming sessions</span>
          </LayerCard.Secondary>
          <LayerCard.Primary>
            <p className="text-2xl tabular-nums text-foreground">{upcomingSessions.length}</p>
          </LayerCard.Primary>
        </LayerCard>
        <LayerCard>
          <LayerCard.Secondary>
            <Users className="size-4" />
            <span>Unique mentees</span>
          </LayerCard.Secondary>
          <LayerCard.Primary>
            <p className="text-2xl tabular-nums text-foreground font-mono">{menteeCount}</p>
          </LayerCard.Primary>
        </LayerCard>
        <LayerCard>
          <LayerCard.Secondary>
            <BarChart3 className="size-4" />
            <span>Completed sessions</span>
          </LayerCard.Secondary>
          <LayerCard.Primary>
            <p className="text-2xl tabular-nums text-foreground">{totalSessions}</p>
          </LayerCard.Primary>
        </LayerCard>
        <LayerCard>
          <LayerCard.Secondary>
            <Clock className="size-4" />
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
          {/* {nextSession && (
            <LayerCard.Secondary>
              <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                with {nextSession.menteeProfile.user.firstName ?? 'Mentee'}
              </p>
            </LayerCard.Secondary>
                <p className="text-xs text-muted-foreground line-clamp-1">
                with {nextSession.menteeProfile.user.firstName ?? "Mentee"}
                </p>
          )} */}
        </LayerCard>
      </div>

      {/* CTA block */}
      <LayerCard>
        <LayerCard.Primary className="p-6 md:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Users className="size-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">
                  {hasCalendly ? 'Your mentor profile is live' : 'Complete your setup'}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {hasCalendly
                    ? 'Mentees can find you and book sessions.'
                    : 'Connect Calendly so mentees can book time with you.'}
                </p>
              </div>
            </div>
            <Button
              asChild
              className="h-11 shrink-0 rounded-lg bg-primary px-5 font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/dashboard/profile">{hasCalendly ? 'Manage profile' : 'Connect Calendly'}</Link>
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
              {upcomingSessions.map((session) => {
                const { user } = session.menteeProfile;
                return (
                  <div key={session.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.image ?? undefined} />
                        <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{session.eventName ?? 'Mentoring Session'}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          with {getFullName(user.firstName, user.lastName)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <RelativeBadge date={session.startTime} />
                      <div className="text-right">
                        <LocalTime
                          date={session.startTime}
                          format="date"
                          className="block text-sm font-medium text-foreground"
                        />
                        <p className="mt-0.5 text-sm text-muted-foreground">
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
          </LayerCard.Primary>
        </LayerCard>
      ) : (
        <LayerCard>
          <LayerCard.Secondary>Upcoming sessions</LayerCard.Secondary>
          <LayerCard.Primary className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No upcoming sessions yet.{' '}
              {hasCalendly
                ? 'Share your profile link so mentees can book time with you.'
                : 'Connect Calendly to start accepting bookings.'}
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
              {recentSessions.map((session) => {
                const { user } = session.menteeProfile;
                return (
                  <div key={session.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.image ?? undefined} />
                        <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-muted-foreground">{session.eventName ?? 'Mentoring Session'}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          with {getFullName(user.firstName, user.lastName)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <LocalTime
                        date={session.startTime}
                        format="date"
                        className="block text-sm font-medium text-muted-foreground"
                      />
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        <LocalTime date={session.startTime} format="time" />
                        {' – '}
                        <LocalTime date={session.endTime} format="time" />
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </LayerCard.Primary>
        </LayerCard>
      )}
    </div>
  );
}
