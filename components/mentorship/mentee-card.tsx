import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Props = {
  firstName: string | null;
  lastName: string | null;
  image: string | null;
  message: string;
  createdAt: Date;
  actions?: React.ReactNode;
};

export function MenteeCard({ firstName, lastName, image, message, createdAt, actions }: Props) {
  const initials = [firstName?.[0], lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?';
  const name = [firstName, lastName].filter(Boolean).join(' ') || 'Mentee';

  return (
    <div className="flex items-start gap-4 p-4">
      <Avatar>
        <AvatarImage src={image ?? undefined} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="font-medium text-foreground">{name}</p>
          <time className="text-xs text-muted-foreground">
            {createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </time>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{message}</p>
        {actions && <div className="pt-2">{actions}</div>}
      </div>
    </div>
  );
}
