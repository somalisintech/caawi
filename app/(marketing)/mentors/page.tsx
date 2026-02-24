import type { Metadata } from 'next';
import { MentorsList } from '@/components/mentors/mentors-list';
import prisma from '@/lib/db';

export const metadata: Metadata = {
  title: 'Find a Mentor | Caawi',
  description: 'Browse and connect with experienced professionals ready to mentor you on your career journey.'
};

export default async function PublicMentorsListPage(props: { searchParams: Promise<{ search?: string }> }) {
  const searchParams = await props.searchParams;
  const search = searchParams.search;

  const mentors = await prisma.mentorProfile.findMany({
    ...(search
      ? {
          where: {
            OR: [
              {
                firstName: {
                  contains: search,
                  mode: 'insensitive'
                }
              },
              {
                lastName: {
                  contains: search,
                  mode: 'insensitive'
                }
              },
              {
                role: {
                  contains: search,
                  mode: 'insensitive'
                }
              },
              {
                company: {
                  contains: search,
                  mode: 'insensitive'
                }
              }
            ]
          }
        }
      : {})
  });

  return (
    <div className="pb-8">
      <MentorsList mentors={mentors} />
    </div>
  );
}
