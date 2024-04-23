import Link from 'next/link';
import prisma from '@/lib/db';
import { Button } from '@/components/ui/button';
import { MentorProfile } from '@/components/mentors/mentor-profile';

export default async function Mentor({ params }: { params: { id: string } }) {
  const mentor = await prisma.mentorProfile.findUniqueOrThrow({
    where: {
      id: params.id
    }
  });

  return (
    <div className="space-y-6">
      <Button asChild variant="secondary">
        <Link className="gap-2" href="/dashboard">
          Go back
        </Link>
      </Button>
      <MentorProfile mentor={mentor} />
    </div>
  );
}
