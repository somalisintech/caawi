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
    <div className="flex flex-col gap-4 p-6">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={mentee.user.image || ''} />
            <AvatarFallback>{name ? name[0] : '-'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="font-semibold">{name || 'Anonymous'}</div>
            {subtitle && <div className="text-sm text-muted-foreground">{subtitle}</div>}
          </div>
        </div>
        <BrowseNudgeButton menteeProfileId={mentee.id} lastNudgedAt={lastNudgedAt} />
      </div>
      {mentee.bio && (
        <div className="flex-1">
          <p className="text-sm text-muted-foreground line-clamp-3">{mentee.bio}</p>
        </div>
      )}
      {mentee.skills.length > 0 && (
        <div className="flex flex-wrap gap-1">
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
