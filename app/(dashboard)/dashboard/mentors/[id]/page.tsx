import prisma from '@/lib/db';
import { MentorProfile } from '@/components/mentors/mentor-profile';

export default async function Mentor({ params }: { params: { id: string } }) {
  const mentor = await prisma.mentorProfile.findUniqueOrThrow({
    where: {
      id: params.id
    }
  });

  return <MentorProfile mentor={mentor} />;
}
