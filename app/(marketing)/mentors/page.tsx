import type { Metadata } from 'next';
import { MentorsList } from '@/components/mentors/mentors-list';
import prisma from '@/lib/db';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Find a Mentor | Caawi',
  description: 'Browse and connect with experienced professionals ready to mentor you on your career journey.'
};

export default async function PublicMentorsListPage(props: {
  searchParams: Promise<{ search?: string; country?: string }>;
}) {
  const searchParams = await props.searchParams;
  const { search, country } = searchParams;

  const where: Record<string, unknown>[] = [];

  if (search) {
    const words = search.trim().split(/\s+/);
    for (const word of words) {
      where.push({
        OR: [
          { firstName: { contains: word, mode: 'insensitive' } },
          { lastName: { contains: word, mode: 'insensitive' } },
          { role: { contains: word, mode: 'insensitive' } },
          { company: { contains: word, mode: 'insensitive' } }
        ]
      });
    }
  }

  if (country) {
    where.push({ country: { equals: country, mode: 'insensitive' } });
  }

  const [mentors, allMentors] = await Promise.all([
    prisma.mentorProfile.findMany(where.length > 0 ? { where: { AND: where } } : undefined),
    prisma.mentorProfile.findMany({ select: { country: true }, distinct: ['country'] })
  ]);

  const countries = allMentors.map((m) => m.country).filter(Boolean) as string[];
  countries.sort();

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <div className="pb-8">
      <MentorsList mentors={mentors} authenticated={!!data.user} countries={countries} />
    </div>
  );
}
