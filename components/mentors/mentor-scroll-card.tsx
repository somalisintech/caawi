import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { MentorProfile } from '@/generated/prisma/client';

type Props = {
  mentor: MentorProfile;
  authenticated: boolean;
};

export function MentorScrollCard({ mentor, authenticated }: Props) {
  const redirectPath = authenticated ? `/dashboard/mentors/${mentor.id}` : '/auth';

  return (
    <Link href={redirectPath} className="flex flex-col gap-4 p-6">
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
      </div>
      <div>{mentor.bio}</div>
      {/* <div className="flex gap-2">
        <Badge variant="secondary">HTML</Badge>
        <Badge variant="secondary">CSS</Badge>
        <Badge variant="secondary">JavaScript</Badge>
      </div> */}
    </Link>
  );
}
