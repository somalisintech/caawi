import { CalendarDays, Users } from 'lucide-react';
import Link from 'next/link';
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
    <div className="flex flex-col gap-4 p-6">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={mentor.image || ''} />
            <AvatarFallback>{mentor.firstName ? mentor.firstName[0] : '-'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="font-semibold">
              {mentor.firstName} {mentor.lastName}
            </div>
            <div className="text-sm text-muted-foreground">
              {mentor.role} @ {mentor.company}
            </div>
          </div>
        </div>
        <div>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link href={redirectPath}>View</Link>
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <div className="bg-muted-background">
          <p>{mentor.bio || '-'}</p>
        </div>
      </div>
      {(mentor.sessionCount > 0 || mentor.memberSince) && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {mentor.sessionCount > 0 && (
            <span className="flex items-center gap-1">
              <Users className="size-3.5" />
              {mentor.sessionCount} {mentor.sessionCount === 1 ? 'session' : 'sessions'}
            </span>
          )}
          {mentor.memberSince && (
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3.5" />
              Mentor since {formatMemberSince(mentor.memberSince)}
            </span>
          )}
        </div>
      )}
      <SkillBadges skills={mentor.skills} />
    </div>
  );
}
