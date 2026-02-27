'use client';

import type { CalendarApi, DatesSetArg, EventClickArg, EventContentArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useEffect, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';

type SessionUser = {
  firstName: string | null;
  lastName: string | null;
  image: string | null;
};

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps: { session: { status: string; counterpart: SessionUser } };
  className: string;
};

export type Props = {
  initialDate: Date;
  events: CalendarEvent[];
  eventClick: (info: EventClickArg) => void;
  datesSet: (arg: DatesSetArg) => void;
  onReady: (api: CalendarApi) => void;
};

function renderEventContent(eventInfo: EventContentArg) {
  const session = eventInfo.event.extendedProps.session as { status: string; counterpart: SessionUser };
  const isCanceled = session.status === 'CANCELED';

  return (
    <div className="flex h-full items-start gap-1.5 overflow-hidden px-2 py-0.5">
      <div className="min-w-0 flex-1">
        <p className={cn('truncate text-[12px] font-medium leading-tight', isCanceled && 'line-through')}>
          {eventInfo.event.title}
        </p>
        <p className="truncate tabular-nums text-[11px] opacity-70">{eventInfo.timeText}</p>
      </div>
    </div>
  );
}

const PLUGINS = [timeGridPlugin, dayGridPlugin, interactionPlugin];

export default function SessionsCalendar({ initialDate, events, eventClick, datesSet, onReady }: Props) {
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    if (calendarRef.current) {
      onReady(calendarRef.current.getApi());
    }
  }, [onReady]);

  // Compute visible time range from session data, with 1h padding
  const { slotMinTime, slotMaxTime } = useMemo(() => {
    let minHour = 7;
    let maxHour = 22;

    for (const e of events) {
      const startH = new Date(e.start).getHours();
      const endH = new Date(e.end).getHours() + (new Date(e.end).getMinutes() > 0 ? 1 : 0);
      if (startH < minHour) minHour = startH;
      if (endH > maxHour) maxHour = endH;
    }

    const min = Math.max(0, minHour - 1);
    const max = Math.min(24, maxHour + 1);
    return {
      slotMinTime: `${String(min).padStart(2, '0')}:00:00`,
      slotMaxTime: `${String(max).padStart(2, '0')}:00:00`
    };
  }, [events]);

  return (
    <FullCalendar
      ref={calendarRef}
      plugins={PLUGINS}
      initialView="timeGridWeek"
      initialDate={initialDate}
      headerToolbar={false}
      events={events}
      eventClick={eventClick}
      eventContent={renderEventContent}
      datesSet={datesSet}
      height="auto"
      allDaySlot={false}
      slotMinTime={slotMinTime}
      slotMaxTime={slotMaxTime}
      scrollTime="08:00:00"
      slotDuration="00:30:00"
      slotLabelInterval="01:00:00"
      expandRows
      nowIndicator
      dayHeaderFormat={{ weekday: 'short', day: 'numeric' }}
      slotLabelFormat={{ hour: 'numeric', minute: '2-digit', meridiem: 'short' }}
    />
  );
}
