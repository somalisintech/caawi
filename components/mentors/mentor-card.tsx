import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { MentorProfile } from '@/generated/prisma/client';

type Props = {
  mentor: MentorProfile;
  authenticated: boolean;
};

export function MentorCard({ mentor, authenticated }: Props) {
  const redirectPath = authenticated ? `/dashboard/mentors/${mentor.id}` : '/auth';

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
    </div>
  );
}
