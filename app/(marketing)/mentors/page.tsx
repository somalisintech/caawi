import { MentorsList } from '@/components/mentors/mentors-list';
import { MentorsSearch } from '@/components/mentors/mentors-search';
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
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Search</h3>
          <p className="text-sm text-muted-foreground">Search for mentors</p>
        </div>
        <MentorsSearch searchQuery={search} />
        <MentorsList mentors={mentors} />
      </div>
    </div>
  );
}
