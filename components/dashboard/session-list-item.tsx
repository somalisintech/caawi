import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LocalTime } from './local-time';
import { RelativeBadge } from './relative-badge';

type Props = {
  session: {
    id: string;
    eventName: string | null;
    startTime: Date;
    endTime: Date;
  };
  otherUser: {
    firstName: string | null;
    lastName: string | null;
    image: string | null;
  };
  isRecent?: boolean;
};

export function getInitials(firstName: string | null, lastName: string | null) {
  return [firstName?.[0], lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?';
}

export function getFullName(firstName: string | null, lastName: string | null) {
  return [firstName, lastName].filter(Boolean).join(' ') || 'User';
}

export function SessionListItem({ session, otherUser, isRecent = false }: Props) {
  return (
    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-10 shrink-0">
          <AvatarImage src={otherUser.image ?? undefined} />
          <AvatarFallback>{getInitials(otherUser.firstName, otherUser.lastName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className={`truncate font-medium ${isRecent ? 'text-muted-foreground' : 'text-foreground'}`}>
            {session.eventName ?? 'Mentoring Session'}
          </p>
          <p className="truncate mt-0.5 text-sm text-muted-foreground">
            with {getFullName(otherUser.firstName, otherUser.lastName)}
          </p>
        </div>
      </div>

      {isRecent ? (
        <div className="shrink-0 text-left sm:text-right">
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
      ) : (
        <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
          <RelativeBadge date={session.startTime} />
          <div className="text-right">
            <LocalTime date={session.startTime} format="date" className="block text-sm font-medium text-foreground" />
            <p className="mt-0.5 text-sm text-muted-foreground">
              <LocalTime date={session.startTime} format="time" />
              {' – '}
              <LocalTime date={session.endTime} format="time" />
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
