import { Badge } from '@/components/ui/badge';
import type { MentorProfile } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';

type Props = {
  mentor: Pick<MentorProfile, 'isAcceptingMentees' | 'onVacation' | 'vacationEndsAt'>;
  className?: string;
};

export function AvailabilityBadge({ mentor, className }: Props) {
  if (mentor.onVacation) {
    return (
      <Badge variant="secondary" className={cn('text-xs', className)}>
        On vacation
        {mentor.vacationEndsAt && ` until ${new Date(mentor.vacationEndsAt).toLocaleDateString()}`}
      </Badge>
    );
  }

  if (!mentor.isAcceptingMentees) {
    return (
      <Badge variant="outline" className={cn('text-xs text-muted-foreground', className)}>
        Not accepting mentees
      </Badge>
    );
  }

  return null;
}
