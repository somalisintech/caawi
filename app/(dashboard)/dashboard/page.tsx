import { redirect } from 'next/navigation';
import { MenteeHome } from '@/components/dashboard/mentee-home';
import { MentorHome } from '@/components/dashboard/mentor-home';
import prisma from '@/lib/db';
import { getMenteeCount, getUpcomingMenteeSessions, getUpcomingSessions } from '@/lib/queries/sessions';
import { createClient } from '@/utils/supabase/server';

export default async function DashboardHomePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect('/auth');
  }

  const user = await prisma.user.findUnique({
    where: { email: data.user.email },
    select: {
      firstName: true,
      profile: {
        select: {
          id: true,
          userType: true,
          calendlyUser: { select: { uri: true } }
        }
      }
    }
  });

  if (user?.profile?.userType === 'MENTOR') {
    const profileId = user.profile.id;
    const [upcomingSessions, menteeCount] = await Promise.all([
      getUpcomingSessions(profileId),
      getMenteeCount(profileId)
    ]);

    return (
      <MentorHome
        firstName={user.firstName}
        hasCalendly={!!user.profile.calendlyUser}
        upcomingSessions={upcomingSessions}
        menteeCount={menteeCount}
      />
    );
  }

  const profileId = user?.profile?.id;
  const [mentorCount, upcomingSessions] = await Promise.all([
    prisma.mentorProfile.count(),
    profileId ? getUpcomingMenteeSessions(profileId) : []
  ]);

  return <MenteeHome firstName={user?.firstName} mentorCount={mentorCount} upcomingSessions={upcomingSessions} />;
}
