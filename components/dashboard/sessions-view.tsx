'use client';

import type { CalendarApi, DatesSetArg, EventClickArg } from '@fullcalendar/core';
import { ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import LayerCard from '@/components/layer-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { LocalTime } from './local-time';
import { RelativeBadge } from './relative-badge';
import { SessionDetail } from './session-detail';
import { EmptyState } from './sessions-empty-state';

const FullCalendar = dynamic(() => import('./sessions-calendar'), {
  ssr: false
});

type SessionUser = {
  firstName: string | null;
  lastName: string | null;
  image: string | null;
};

type Session = {
  id: string;
  eventName: string | null;
  startTime: string;
  endTime: string;
  status: 'ACTIVE' | 'CANCELED';
  canceledAt: string | null;
  counterpart: SessionUser;
};

type Props = {
  sessions: Session[];
  userType: 'MENTOR' | 'MENTEE';
  hasCalendly: boolean;
  year: number;
  month: number;
  day: number;
};

type ViewMode = 'week' | 'month';
type Filter = 'all' | 'upcoming' | 'past' | 'canceled';

function getInitials(firstName: string | null, lastName: string | null) {
  return [firstName?.[0], lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?';
}

function getFullName(user: SessionUser) {
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unknown';
}

export function SessionsView({ sessions, userType, hasCalendly, year, month, day }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const calendarApiRef = useRef<CalendarApi | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [calendarTitle, setCalendarTitle] = useState('');
  const [nowTs, setNowTs] = useState(() => Date.now());

  useEffect(() => {
    // Only update once per hour or when crossing a day boundary
    // to avoid excessive re-renders of the large calendar tree
    const id = setInterval(
      () => {
        setNowTs(Date.now());
      },
      60 * 60 * 1000
    );
    return () => clearInterval(id);
  }, []);

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = new Date(nowTs);

  const { filteredSessions, upcomingSessions, monthFilteredSessions } = useMemo(() => {
    const filtered: Session[] = [];
    const upcoming: Session[] = [];
    const monthFiltered: Session[] = [];

    const matchesFilter = (session: Session, start: Date, isActive: boolean) => {
      if (filter === 'all') return true;
      if (filter === 'canceled') return session.status === 'CANCELED';
      if (filter === 'past') return isActive && start < now;
      return isActive && start >= now;
    };

    for (const s of sessions) {
      const start = new Date(s.startTime);
      const isActive = s.status === 'ACTIVE';
      const inRequestedMonth = start.getFullYear() === year && start.getMonth() === month;

      if (isActive && start >= now) {
        upcoming.push(s);
      }

      if (matchesFilter(s, start, isActive)) {
        filtered.push(s);
        if (inRequestedMonth) {
          monthFiltered.push(s);
        }
      }
    }

    return {
      filteredSessions: filtered,
      upcomingSessions: upcoming,
      monthFilteredSessions: monthFiltered
    };
  }, [sessions, filter, month, now, year]);

  const calendarEvents = useMemo(() => {
    return filteredSessions.map((s) => {
      const isCanceled = s.status === 'CANCELED';
      return {
        id: s.id,
        title: s.eventName ?? 'Mentoring Session',
        start: s.startTime,
        end: s.endTime,
        extendedProps: { session: s },
        className: cn(
          'fc-caawi-event cursor-pointer !rounded-sm !border-0 !text-[13px]',
          isCanceled
            ? '!bg-muted/60 !text-muted-foreground line-through opacity-60'
            : '!bg-primary !text-primary-foreground hover:!bg-primary/90 dark:!bg-primary/20 dark:hover:!bg-primary/30'
        )
      };
    });
  }, [filteredSessions]);

  const handleEventClick = useCallback((info: EventClickArg) => {
    const session = info.event.extendedProps.session as Session;
    setSelectedSession(session);
  }, []);

  const handleDatesSet = useCallback(
    (arg: DatesSetArg) => {
      setCalendarTitle(arg.view.title);
      const anchor = arg.view.currentStart;
      const newYear = anchor.getFullYear();
      const newMonth = anchor.getMonth();
      const newDay = anchor.getDate();

      if (newMonth !== month || newYear !== year || newDay !== day) {
        startTransition(() => {
          router.replace(`/dashboard/sessions?year=${newYear}&month=${newMonth}&day=${newDay}`, { scroll: false });
        });
      }
    },
    [day, month, year, router]
  );

  const handleCalendarReady = useCallback((api: CalendarApi) => {
    calendarApiRef.current = api;
  }, []);

  function navigateCalendar(action: 'prev' | 'next' | 'today') {
    const api = calendarApiRef.current;
    if (!api) return;
    if (action === 'prev') api.prev();
    else if (action === 'next') api.next();
    else api.today();
  }

  function switchView(mode: ViewMode) {
    const api = calendarApiRef.current;
    if (!api) return;
    setViewMode(mode);
    if (mode === 'week') {
      api.changeView(window.innerWidth < 768 ? 'timeGridDay' : 'timeGridWeek');
    } else {
      api.changeView('dayGridMonth');
    }
  }

  const roleLabel = userType === 'MENTOR' ? 'Mentee' : 'Mentor';
  const isEmpty = sessions.length === 0;

  const filters: { key: Filter; label: string; count?: number }[] = [
    { key: 'all', label: 'All', count: sessions.length },
    { key: 'upcoming', label: 'Upcoming', count: upcomingSessions.length },
    { key: 'past', label: 'Past' },
    { key: 'canceled', label: 'Canceled' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-pretty text-4xl font-bold text-foreground leading-[44px]">Sessions</h1>
          <p className="mt-1.5 text-pretty text-[15px] leading-relaxed text-muted-foreground">
            Your mentorship calendar, all sessions at a glance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/40 px-3 py-1.5 text-[13px] text-muted-foreground">
            <Globe className="size-3.5" />
            <span>{tz.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Controls bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              aria-label="Previous period"
              onClick={() => navigateCalendar('prev')}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-[13px] font-medium"
              onClick={() => navigateCalendar('today')}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              aria-label="Next period"
              onClick={() => navigateCalendar('next')}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <span className="ml-1 text-[15px] font-semibold text-foreground">{calendarTitle}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Filters */}
          <div className="flex gap-1 rounded-lg border border-border/60 bg-muted/30 p-0.5 dark:bg-zinc-900/50">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={cn(
                  'rounded-md px-2.5 py-1 text-[13px] font-medium transition-colors cursor-pointer',
                  filter === f.key
                    ? 'bg-background text-foreground shadow-sm dark:bg-zinc-800'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {f.label}
                {f.count !== undefined ? (
                  <span
                    className={cn(
                      'ml-1 tabular-nums text-[11px]',
                      filter === f.key ? 'text-muted-foreground' : 'text-[#aaa] dark:text-zinc-600'
                    )}
                  >
                    {f.count}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex gap-0.5 rounded-lg border border-border/60 bg-muted/30 p-0.5 dark:bg-zinc-900/50">
            <button
              type="button"
              onClick={() => switchView('week')}
              className={cn(
                'rounded-md px-2.5 py-1 text-[13px] font-medium transition-colors',
                viewMode === 'week'
                  ? 'bg-background text-foreground shadow-sm dark:bg-zinc-800'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <span className="hidden sm:inline">Week</span>
              <span className="sm:hidden">Day</span>
            </button>
            <button
              type="button"
              onClick={() => switchView('month')}
              className={cn(
                'rounded-md px-2.5 py-1 text-[13px] font-medium transition-colors',
                viewMode === 'month'
                  ? 'bg-background text-foreground shadow-sm dark:bg-zinc-800'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Main content: 70/30 split */}
      {isEmpty ? (
        <EmptyState userType={userType} hasCalendly={hasCalendly} />
      ) : (
        <div className="flex flex-col gap-6 xl:flex-row">
          {/* Calendar (primary) */}
          <div className="min-w-0 xl:flex-[7]">
            <LayerCard>
              <LayerCard.Primary className="p-4">
                <FullCalendar
                  initialDate={new Date(year, month, day)}
                  events={calendarEvents}
                  eventClick={handleEventClick}
                  datesSet={handleDatesSet}
                  onReady={handleCalendarReady}
                />
              </LayerCard.Primary>
            </LayerCard>
          </div>

          {/* Agenda rail (secondary) */}
          <div className="xl:flex-[3]">
            <div className="sticky top-8 space-y-4">
              {/* Next up */}
              <LayerCard>
                <LayerCard.Secondary>Next up</LayerCard.Secondary>
                <LayerCard.Primary className="pt-2">
                  {upcomingSessions.length > 0 ? (
                    <div className="space-y-1">
                      {upcomingSessions.slice(0, 3).map((s) => (
                        <button
                          type="button"
                          key={s.id}
                          onClick={() => setSelectedSession(s)}
                          className="group flex w-full items-center gap-3 rounded-md p-2.5 text-left transition-colors hover:bg-muted/60 dark:hover:bg-zinc-900/60 cursor-pointer"
                        >
                          <Avatar className="size-9 ring-2 ring-background">
                            <AvatarImage src={s.counterpart.image ?? undefined} />
                            <AvatarFallback className="text-xs">
                              {getInitials(s.counterpart.firstName, s.counterpart.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-medium text-foreground">
                              {s.eventName ?? 'Mentoring Session'}
                            </p>
                            <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                              {getFullName(s.counterpart)}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <RelativeBadge date={new Date(s.startTime)} />
                            <LocalTime
                              date={new Date(s.startTime)}
                              format="time"
                              className="mt-0.5 block text-[12px] tabular-nums text-muted-foreground"
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[13px] text-muted-foreground">No upcoming sessions.</p>
                  )}
                </LayerCard.Primary>
              </LayerCard>

              {/* Full agenda */}
              <LayerCard>
                <LayerCard.Secondary className="border-b border-border">
                  This month
                  <span className="ml-1.5 tabular-nums text-[12px] font-normal text-muted-foreground">
                    {monthFilteredSessions.length} sessions
                  </span>
                </LayerCard.Secondary>
                <LayerCard.Primary className="p-0">
                  <ScrollArea className="max-h-[400px]">
                    <div className="divide-y divide-border/40">
                      {monthFilteredSessions.length > 0 ? (
                        monthFilteredSessions.map((s) => {
                          const isCanceled = s.status === 'CANCELED';
                          return (
                            <button
                              type="button"
                              key={s.id}
                              onClick={() => setSelectedSession(s)}
                              className={cn(
                                'flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-muted/50 dark:hover:bg-zinc-900/40 cursor-pointer',
                                selectedSession?.id === s.id && 'bg-muted/60 dark:bg-zinc-900/60'
                              )}
                            >
                              <div
                                className={cn(
                                  'h-8 w-1 shrink-0 rounded-full',
                                  isCanceled ? 'bg-muted-foreground/30' : 'bg-primary/70'
                                )}
                              />
                              <div className="min-w-0 flex-1">
                                <p
                                  className={cn(
                                    'truncate text-[13px] font-medium',
                                    isCanceled ? 'text-muted-foreground line-through' : 'text-foreground'
                                  )}
                                >
                                  {s.eventName ?? 'Mentoring Session'}
                                </p>
                                <p className="mt-0.5 text-[12px] text-muted-foreground">
                                  <LocalTime date={new Date(s.startTime)} format="date" /> ·{' '}
                                  {getFullName(s.counterpart)}
                                </p>
                              </div>
                              {isCanceled ? (
                                <Badge
                                  variant="outline"
                                  className="shrink-0 text-[11px] font-normal text-muted-foreground"
                                >
                                  Canceled
                                </Badge>
                              ) : null}
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-5 py-8 text-center text-[13px] text-muted-foreground">
                          No {filter === 'all' ? '' : filter} sessions this month.
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </LayerCard.Primary>
              </LayerCard>
            </div>
          </div>
        </div>
      )}

      {/* Session detail dialog */}
      <Dialog open={!!selectedSession} onOpenChange={(open) => !open && setSelectedSession(null)}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none sm:max-w-md">
          {selectedSession ? (
            <LayerCard>
              <LayerCard.Secondary className="py-4">
                <DialogTitle className="text-base font-normal border-0">
                  {selectedSession.eventName ?? 'Mentoring Session'}
                </DialogTitle>
              </LayerCard.Secondary>
              <LayerCard.Primary className="p-5 rounded-2xl">
                <SessionDetail session={selectedSession} roleLabel={roleLabel} />
              </LayerCard.Primary>
            </LayerCard>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
