import prisma from '@/lib/db';
import { MentorProfile } from '@/components/mentors/mentor-profile';

export default async function Mentor({ params }: { params: { id: string } }) {
  const mentor = await prisma.mentorProfile.findUnique({
    where: {
      id: params.id
    }
  });

  return mentor && <MentorProfile mentor={mentor} />;
}
