import { MentorsList } from '@/components/mentors/mentors-list';
import prisma from '@/lib/db';

export default async function PublicMentorsListPage({ searchParams }: { searchParams: { search?: string } }) {
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
