import { MentorProfile } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

type Props = {
  mentor: MentorProfile;
};

export async function MentorCard({ mentor }: Props) {
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
          <Button asChild size="icon" variant="secondary" className="rounded-full">
            <Link href={`/dashboard/mentors/${mentor.id}`}>
              <ArrowUpRight size={16} />
            </Link>
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
