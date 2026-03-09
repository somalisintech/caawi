import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { MenteeWithDetails } from '@/lib/queries/mentees';
import { BrowseNudgeButton } from './browse-nudge-button';

type Props = {
  mentee: MenteeWithDetails;
  lastNudgedAt: Date | null;
};

export function MenteeBrowseCard({ mentee, lastNudgedAt }: Props) {
  const name = [mentee.user.firstName, mentee.user.lastName].filter(Boolean).join(' ');
  const subtitle = [mentee.occupation?.role, mentee.occupation?.company].filter(Boolean).join(' @ ');

  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/15">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={mentee.user.image || ''} />
            <AvatarFallback>{name ? name[0] : '-'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{name || 'Anonymous'}</div>
            {subtitle && <div className="text-sm text-muted-foreground">{subtitle}</div>}
          </div>
        </div>
        <div className="shrink-0">
          <BrowseNudgeButton menteeProfileId={mentee.id} lastNudgedAt={lastNudgedAt} />
        </div>
      </div>

      {mentee.bio && <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{mentee.bio}</p>}

      {mentee.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {mentee.skills.map((skill) => (
            <span key={skill.id} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
              {skill.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
