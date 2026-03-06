import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { MenteesBrowseList } from '@/components/mentees/mentees-browse-list';
import prisma from '@/lib/db';
import { getMenteesWithCountries } from '@/lib/queries/mentees';
import { createClient } from '@/utils/supabase/server';
import BrowseMenteesLoading from './loading';

type SearchParams = Promise<{ search?: string; country?: string; page?: string }>;

export default function BrowseMenteesPage(props: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<BrowseMenteesLoading />}>
      <BrowseMenteesContent searchParams={props.searchParams} />
    </Suspense>
  );
}

async function BrowseMenteesContent({ searchParams: searchParamsPromise }: { searchParams: SearchParams }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect('/auth');

  const profile = await prisma.profile.findUnique({
    where: { userId: data.user.id },
    select: { id: true, userType: true }
  });

  if (!profile || profile.userType !== 'MENTOR') redirect('/dashboard');

  const searchParams = await searchParamsPromise;
  const [{ mentees, countries, totalCount, totalPages, currentPage }, nudges] = await Promise.all([
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

  function buildHref(page: number) {
    const params = new URLSearchParams();
    if (searchParams.search) params.set('search', searchParams.search);
    if (searchParams.country) params.set('country', searchParams.country);
    if (page > 1) params.set('page', String(page));
    return params.toString() ? `?${params}` : '?';
  }

  return (
    <MenteesBrowseList
      mentees={mentees}
      countries={countries}
      nudgeMap={nudgeMap}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={currentPage}
      buildHref={buildHref}
    />
  );
}
