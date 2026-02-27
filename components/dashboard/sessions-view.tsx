'use client';

import type { CalendarApi, DatesSetArg, EventClickArg } from '@fullcalendar/core';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Globe, Search } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { LocalTime } from './local-time';
import { RelativeBadge } from './relative-badge';

const FullCalendar = dynamic(() => import('./sessions-calendar'), { ssr: false });

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
    const id = setInterval(() => setNowTs(Date.now()), 60_000);
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

    return { filteredSessions: filtered, upcomingSessions: upcoming, monthFilteredSessions: monthFiltered };
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
          'fc-caawi-event cursor-pointer !rounded-lg !border-0 !text-[13px]',
          isCanceled
            ? '!bg-muted/60 !text-muted-foreground line-through opacity-60'
            : '!bg-primary/10 !text-primary hover:!bg-primary/20 dark:!bg-primary/20 dark:hover:!bg-primary/30'
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
    api.changeView(mode === 'week' ? 'timeGridWeek' : 'dayGridMonth');
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
          <h1 className="text-pretty text-4xl font-bold text-[#111] leading-[44px] dark:text-zinc-50">Sessions</h1>
          <p className="mt-1.5 text-pretty text-[15px] leading-relaxed text-[#666] dark:text-zinc-400">
            Your mentorship calendar — all sessions at a glance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 text-[13px] text-[#777] dark:bg-zinc-900/50 dark:text-zinc-400">
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
          <span className="ml-1 text-[15px] font-semibold text-[#111] dark:text-zinc-100">{calendarTitle}</span>
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
                  'rounded-md px-2.5 py-1 text-[13px] font-medium transition-colors',
                  filter === f.key
                    ? 'bg-background text-foreground shadow-sm dark:bg-zinc-800'
                    : 'text-[#888] hover:text-foreground dark:text-zinc-500 dark:hover:text-zinc-300'
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
                  : 'text-[#888] hover:text-foreground dark:text-zinc-500'
              )}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => switchView('month')}
              className={cn(
                'rounded-md px-2.5 py-1 text-[13px] font-medium transition-colors',
                viewMode === 'month'
                  ? 'bg-background text-foreground shadow-sm dark:bg-zinc-800'
                  : 'text-[#888] hover:text-foreground dark:text-zinc-500'
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
            <div className="rounded-2xl border border-border/60 bg-background p-4 shadow-sm dark:bg-zinc-950 dark:shadow-none">
              <FullCalendar
                initialDate={new Date(year, month, day)}
                events={calendarEvents}
                eventClick={handleEventClick}
                datesSet={handleDatesSet}
                onReady={handleCalendarReady}
              />
            </div>
          </div>

          {/* Agenda rail (secondary) */}
          <div className="xl:flex-[3]">
            <div className="sticky top-8 space-y-4">
              {/* Next up */}
              <div className="rounded-2xl border border-border/60 bg-background p-5 shadow-sm dark:bg-zinc-950 dark:shadow-none">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                    <Clock className="size-4 text-primary" />
                  </div>
                  <h2 className="text-[14px] font-semibold text-[#111] dark:text-zinc-100">Next up</h2>
                </div>
                {upcomingSessions.length > 0 ? (
                  <div className="mt-4 space-y-1">
                    {upcomingSessions.slice(0, 3).map((s) => (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => setSelectedSession(s)}
                        className="group flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-muted/60 dark:hover:bg-zinc-900/60"
                      >
                        <Avatar className="size-9 ring-2 ring-background">
                          <AvatarImage src={s.counterpart.image ?? undefined} />
                          <AvatarFallback className="text-xs">
                            {getInitials(s.counterpart.firstName, s.counterpart.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium text-[#111] dark:text-zinc-100">
                            {s.eventName ?? 'Mentoring Session'}
                          </p>
                          <p className="mt-0.5 truncate text-[12px] text-[#888] dark:text-zinc-500">
                            {getFullName(s.counterpart)}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <RelativeBadge date={new Date(s.startTime)} />
                          <LocalTime
                            date={new Date(s.startTime)}
                            format="time"
                            className="mt-0.5 block text-[12px] tabular-nums text-[#888] dark:text-zinc-500"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-[13px] text-[#888] dark:text-zinc-500">No upcoming sessions.</p>
                )}
              </div>

              {/* Full agenda */}
              <div className="rounded-2xl border border-border/60 bg-background shadow-sm dark:bg-zinc-950 dark:shadow-none">
                <div className="border-b border-border/60 px-5 py-4">
                  <h2 className="text-[14px] font-semibold text-[#111] dark:text-zinc-100">
                    This month
                    <span className="ml-1.5 tabular-nums text-[12px] font-normal text-[#999] dark:text-zinc-500">
                      {monthFilteredSessions.length} sessions
                    </span>
                  </h2>
                </div>
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
                              'flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-muted/50 dark:hover:bg-zinc-900/40',
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
                                  isCanceled
                                    ? 'text-[#aaa] line-through dark:text-zinc-600'
                                    : 'text-[#111] dark:text-zinc-100'
                                )}
                              >
                                {s.eventName ?? 'Mentoring Session'}
                              </p>
                              <p className="mt-0.5 text-[12px] text-[#888] dark:text-zinc-500">
                                <LocalTime date={new Date(s.startTime)} format="date" /> · {getFullName(s.counterpart)}
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
                      <div className="px-5 py-8 text-center text-[13px] text-[#888] dark:text-zinc-500">
                        No {filter === 'all' ? '' : filter} sessions this month.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session detail dialog */}
      <Dialog open={!!selectedSession} onOpenChange={(open) => !open && setSelectedSession(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedSession ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">{selectedSession.eventName ?? 'Mentoring Session'}</DialogTitle>
              </DialogHeader>
              <SessionDetail session={selectedSession} roleLabel={roleLabel} />
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SessionDetail({ session, roleLabel }: { session: Session; roleLabel: string }) {
  const isCanceled = session.status === 'CANCELED';
  const { counterpart } = session;

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="size-14 ring-2 ring-border">
          <AvatarImage src={counterpart.image ?? undefined} />
          <AvatarFallback className="text-xl">
            {getInitials(counterpart.firstName, counterpart.lastName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-[16px] font-semibold text-[#111] dark:text-zinc-50">{getFullName(counterpart)}</p>
          <p className="mt-0.5 text-[13px] text-[#888] dark:text-zinc-400">{roleLabel}</p>
        </div>
      </div>

      <div className="space-y-0 divide-y divide-border/60 rounded-xl border border-border/60 bg-muted/20 dark:bg-zinc-900/30">
        <DetailRow label="Date">
          <LocalTime
            date={new Date(session.startTime)}
            format="date"
            className="text-[14px] font-medium text-[#111] dark:text-zinc-100"
          />
        </DetailRow>
        <DetailRow label="Time">
          <span className="tabular-nums text-[14px] font-medium text-[#111] dark:text-zinc-100">
            <LocalTime date={new Date(session.startTime)} format="time" />
            {' – '}
            <LocalTime date={new Date(session.endTime)} format="time" />
          </span>
        </DetailRow>
        <DetailRow label="Status">
          {isCanceled ? (
            <Badge variant="destructive" className="text-[12px]">
              Canceled
            </Badge>
          ) : (
            <Badge className="border-emerald-200 bg-emerald-50 text-[12px] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              Active
            </Badge>
          )}
        </DetailRow>
        {isCanceled && session.canceledAt ? (
          <DetailRow label="Canceled at">
            <LocalTime
              date={new Date(session.canceledAt)}
              format="datetime"
              className="tabular-nums text-[14px] font-medium text-[#888] dark:text-zinc-400"
            />
          </DetailRow>
        ) : null}
      </div>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="text-[13px] text-[#888] dark:text-zinc-400">{label}</span>
      {children}
    </div>
  );
}

function EmptyState({ userType, hasCalendly }: { userType: 'MENTOR' | 'MENTEE'; hasCalendly: boolean }) {
  if (userType === 'MENTOR' && !hasCalendly) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-muted/20 px-8 py-16 text-center dark:bg-zinc-900/20">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 dark:bg-primary/20">
          <CalendarDays className="size-7 text-primary" />
        </div>
        <h3 className="mt-5 text-balance text-[18px] font-semibold text-[#111] dark:text-zinc-100">
          Connect Calendly to get started
        </h3>
        <p className="mt-2 max-w-sm text-pretty text-[14px] leading-relaxed text-[#888] dark:text-zinc-400">
          Once connected, mentees can discover your profile and book sessions directly.
        </p>
        <Button asChild className="mt-6 h-11 rounded-xl px-6 font-semibold">
          <Link href="/dashboard/profile">Connect Calendly</Link>
        </Button>
      </div>
    );
  }

  if (userType === 'MENTEE') {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-muted/20 px-8 py-16 text-center dark:bg-zinc-900/20">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 dark:bg-primary/20">
          <Search className="size-7 text-primary" />
        </div>
        <h3 className="mt-5 text-balance text-[18px] font-semibold text-[#111] dark:text-zinc-100">
          Book your first session
        </h3>
        <p className="mt-2 max-w-sm text-pretty text-[14px] leading-relaxed text-[#888] dark:text-zinc-400">
          Browse our mentors and schedule a time that works for you.
        </p>
        <Button asChild className="mt-6 h-11 rounded-xl px-6 font-semibold">
          <Link href="/dashboard/mentors">Find a mentor</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-muted/20 px-8 py-16 text-center dark:bg-zinc-900/20">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 dark:bg-primary/20">
        <CalendarDays className="size-7 text-primary" />
      </div>
      <h3 className="mt-5 text-balance text-[18px] font-semibold text-[#111] dark:text-zinc-100">No sessions yet</h3>
      <p className="mt-2 max-w-sm text-pretty text-[14px] leading-relaxed text-[#888] dark:text-zinc-400">
        Share your profile so mentees can book time with you.
      </p>
    </div>
  );
}
