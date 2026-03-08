import { CalendarDays, Users } from 'lucide-react';
import Link from 'next/link';
import { AvailabilityBadge } from '@/components/mentors/availability-badge';
import { SkillBadges } from '@/components/mentors/skill-badges';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { MentorProfile } from '@/generated/prisma/client';
import { formatMemberSince } from '@/lib/format-member-since';

type Props = {
  mentor: MentorProfile;
  authenticated: boolean;
};

export function MentorCard({ mentor, authenticated }: Props) {
  const mentorPath = `/dashboard/mentors/${mentor.id}`;
  const redirectPath = authenticated ? mentorPath : `/auth?next=${mentorPath}`;

  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/15">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={mentor.image || ''} />
            <AvatarFallback>{mentor.firstName ? mentor.firstName[0] : '-'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">
              {mentor.firstName} {mentor.lastName}
            </div>
            <div className="text-sm text-muted-foreground">
              {mentor.role} @ {mentor.company}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <AvailabilityBadge mentor={mentor} />
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link href={redirectPath}>View</Link>
          </Button>
        </div>
      </div>

      {mentor.bio && <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{mentor.bio}</p>}

      <div className="mt-3 flex items-center justify-between gap-4">
        <SkillBadges skills={mentor.skills} />
        <div className="flex shrink-0 items-center gap-4 text-xs text-muted-foreground">
          {mentor.sessionCount > 0 && (
            <span className="flex items-center gap-1">
              <Users className="size-3" />
              {mentor.sessionCount} {mentor.sessionCount === 1 ? 'session' : 'sessions'}
            </span>
          )}
          {mentor.memberSince && (
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3" />
              {formatMemberSince(mentor.memberSince)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
