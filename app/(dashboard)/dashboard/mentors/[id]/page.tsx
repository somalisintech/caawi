import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { MentorProfile } from '@/components/mentors/mentor-profile';
import prisma from '@/lib/db';
import MentorDetailLoading from './loading';

export default function Mentor(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<MentorDetailLoading />}>
      <MentorContent params={props.params} />
    </Suspense>
  );
}

async function MentorContent({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
  const mentor = await prisma.mentorProfile.findUnique({
    where: {
      id: params.id
    }
  });

  if (!mentor) notFound();

  return <MentorProfile mentor={mentor} />;
}
