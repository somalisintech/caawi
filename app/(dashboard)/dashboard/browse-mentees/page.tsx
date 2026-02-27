import { redirect } from 'next/navigation';
import { MenteesBrowseList } from '@/components/mentees/mentees-browse-list';
import prisma from '@/lib/db';
import { getMenteesWithCountries } from '@/lib/queries/mentees';
import { createClient } from '@/utils/supabase/server';

export default async function BrowseMenteesPage(props: {
  searchParams: Promise<{ search?: string; country?: string }>;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect('/auth');

  const profile = await prisma.profile.findUnique({
    where: { userId: data.user.id },
    select: { id: true, userType: true }
  });

  if (!profile || profile.userType !== 'MENTOR') redirect('/dashboard');

  const searchParams = await props.searchParams;
  const [{ mentees, countries }, nudges] = await Promise.all([
    getMenteesWithCountries(searchParams),
    prisma.menteeNudge.findMany({
      where: { mentorProfileId: profile.id },
      select: { menteeProfileId: true, lastNudgedAt: true }
    })
  ]);

  const nudgeMap: Record<string, Date | null> = {};
  for (const nudge of nudges) {
    nudgeMap[nudge.menteeProfileId] = nudge.lastNudgedAt;
  }

  return <MenteesBrowseList mentees={mentees} countries={countries} nudgeMap={nudgeMap} />;
}
