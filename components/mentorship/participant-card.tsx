import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Props = {
  firstName: string | null;
  lastName: string | null;
  image: string | null;
  message?: string;
  createdAt: Date;
  actions?: React.ReactNode;
};

export function ParticipantCard({ firstName, lastName, image, message, createdAt, actions }: Props) {
  const initials = [firstName?.[0], lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?';
  const name = [firstName, lastName].filter(Boolean).join(' ') || 'Member';

  return (
    <div className="flex items-center gap-4 p-4">
      <Avatar>
        <AvatarImage src={image ?? undefined} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <p className="truncate font-medium text-foreground">{name}</p>
          <span className="shrink-0 text-xs text-muted-foreground">
            · {createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
        {message && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{message}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
