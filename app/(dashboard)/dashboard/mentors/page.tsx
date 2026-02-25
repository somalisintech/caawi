import { MentorsList } from '@/components/mentors/mentors-list';
import prisma from '@/lib/db';
import { createClient } from '@/utils/supabase/server';

export default async function MentorsListPage(props: { searchParams: Promise<{ search?: string }> }) {
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

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return <MentorsList mentors={mentors} authenticated={!!data.user} />;
}
