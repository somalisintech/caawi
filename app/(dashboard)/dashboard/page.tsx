import { redirect } from 'next/navigation';
import { MentorHome } from '@/components/dashboard/mentor-home';
import { MentorsList } from '@/components/mentors/mentors-list';
import prisma from '@/lib/db';
import { getMentorsWithCountries } from '@/lib/queries/mentors';
import { createClient } from '@/utils/supabase/server';

export default async function DashboardHomePage(props: {
  searchParams: Promise<{ search?: string; country?: string }>;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect('/auth');
  }

  const user = await prisma.user.findUnique({
    where: { email: data.user.email },
    select: { firstName: true, profile: { select: { userType: true, calendlyUser: { select: { uri: true } } } } }
  });

  if (user?.profile?.userType === 'MENTOR') {
    return <MentorHome firstName={user.firstName} hasCalendly={!!user.profile.calendlyUser} />;
  }

  const searchParams = await props.searchParams;
  const { mentors, countries } = await getMentorsWithCountries(searchParams);

  return <MentorsList mentors={mentors} authenticated={true} countries={countries} />;
}
