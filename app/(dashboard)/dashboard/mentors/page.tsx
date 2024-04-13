import { MentorsList } from '@/components/mentors/mentors-list';
import { MentorsSearch } from '@/components/mentors/mentors-search';
import { Card } from '@/components/ui/card';
import prisma from '@/lib/db';

export default async function MentorsListPage({ searchParams }: { searchParams: { search?: string } }) {
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
              },
              {
                country: {
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
        <Card className="sticky top-8 z-10 bg-background p-6 shadow-md">
          <div className="mb-2 h-fit">
            <h3 className="text-lg font-medium">Search</h3>
          </div>
          <MentorsSearch searchQuery={search} />
        </Card>
        <MentorsList mentors={mentors} />
      </div>
    </div>
  );
}
