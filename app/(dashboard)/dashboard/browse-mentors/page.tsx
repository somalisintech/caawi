import { Suspense } from 'react';
import { MentorsList } from '@/components/mentors/mentors-list';
import { SKILLS_BY_CATEGORY } from '@/lib/constants/skills';
import { getMentorsWithCountries } from '@/lib/queries/mentors';
import MentorsLoading from './loading';

type SearchParams = Promise<{ search?: string; country?: string; skills?: string | string[]; page?: string }>;

export default function MentorsListPage(props: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<MentorsLoading />}>
      <MentorsContent searchParams={props.searchParams} />
    </Suspense>
  );
}

async function MentorsContent({ searchParams: searchParamsPromise }: { searchParams: SearchParams }) {
  const searchParams = await searchParamsPromise;
  const { mentors, countries, totalCount, totalPages, currentPage } = await getMentorsWithCountries(searchParams);

  function buildHref(page: number) {
    const params = new URLSearchParams();
    if (searchParams.search) params.set('search', searchParams.search);
    if (searchParams.country) params.set('country', searchParams.country);
    if (searchParams.skills) {
      const skills = Array.isArray(searchParams.skills) ? searchParams.skills : [searchParams.skills];
      for (const skill of skills) params.append('skills', skill);
    }
    if (page > 1) params.set('page', String(page));
    return params.toString() ? `?${params}` : '?';
  }

  return (
    <MentorsList
      mentors={mentors}
      authenticated={true}
      countries={countries}
      allSkills={SKILLS_BY_CATEGORY}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={currentPage}
      buildHref={buildHref}
    />
  );
}
