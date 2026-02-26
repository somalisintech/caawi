import { MentorsList } from '@/components/mentors/mentors-list';
import { getMentorsWithCountries } from '@/lib/queries/mentors';

export default async function MentorsListPage(props: { searchParams: Promise<{ search?: string; country?: string }> }) {
  const searchParams = await props.searchParams;
  const { mentors, countries } = await getMentorsWithCountries(searchParams);

  return <MentorsList mentors={mentors} authenticated={true} countries={countries} />;
}
