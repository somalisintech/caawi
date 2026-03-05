import { notFound } from 'next/navigation';
import { MentorProfile } from '@/components/mentors/mentor-profile';
import prisma from '@/lib/db';

export default async function Mentor(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const mentor = await prisma.mentorProfile.findUnique({
    where: {
      id: params.id
    }
  });

  if (!mentor) notFound();

  return <MentorProfile mentor={mentor} />;
}
