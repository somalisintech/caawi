import type { Metadata } from 'next';
import { MentorsList } from '@/components/mentors/mentors-list';
import { SKILLS_BY_CATEGORY } from '@/lib/constants/skills';
import { getMentorsWithCountries } from '@/lib/queries/mentors';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Find a Mentor | Caawi',
  description: 'Browse and connect with experienced professionals ready to mentor you on your career journey.'
};

export default async function PublicMentorsListPage(props: {
  searchParams: Promise<{ search?: string; country?: string; skills?: string | string[] }>;
}) {
  const searchParams = await props.searchParams;
  const { mentors, countries } = await getMentorsWithCountries(searchParams);

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <div className="pb-8">
      <MentorsList mentors={mentors} authenticated={!!data.user} countries={countries} allSkills={SKILLS_BY_CATEGORY} />
    </div>
  );
}
