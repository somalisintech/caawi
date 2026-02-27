'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LocalTime } from './local-time';

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
  session: Session;
  roleLabel: string;
};

function getInitials(firstName: string | null, lastName: string | null) {
  return [firstName?.[0], lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?';
}

function getFullName(user: SessionUser) {
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unknown';
}

export function SessionDetail({ session, roleLabel }: Props) {
  const isCanceled = session.status === 'CANCELED';
  const { counterpart } = session;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="size-14 ring-2 ring-border">
          <AvatarImage src={counterpart.image ?? undefined} />
          <AvatarFallback className="text-xl">
            {getInitials(counterpart.firstName, counterpart.lastName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-[16px] font-semibold text-foreground">{getFullName(counterpart)}</p>
          <p className="mt-0.5 text-[13px] text-muted-foreground">{roleLabel}</p>
        </div>
      </div>

      <div className="space-y-0 divide-y divide-border/60 rounded-md border border-border/60 bg-muted/20 dark:bg-zinc-900/30">
        <DetailRow label="Date">
          <LocalTime
            date={new Date(session.startTime)}
            format="date"
            className="text-[14px] font-medium text-foreground"
          />
        </DetailRow>
        <DetailRow label="Time">
          <span className="tabular-nums text-[14px] font-medium text-foreground">
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
              className="tabular-nums text-[14px] font-medium text-muted-foreground"
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
      <span className="text-[13px] text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}
