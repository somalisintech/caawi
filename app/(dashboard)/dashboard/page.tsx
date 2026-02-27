import { redirect } from 'next/navigation';
import { MenteeHome } from '@/components/dashboard/mentee-home';
import { MentorHome } from '@/components/dashboard/mentor-home';
import prisma from '@/lib/db';
import {
  getMenteeCount,
  getRecentMenteeSessions,
  getRecentSessions,
  getTotalSessionCount,
  getUpcomingMenteeSessions,
  getUpcomingSessions
} from '@/lib/queries/sessions';
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
    const [upcomingSessions, menteeCount, totalSessions, recentSessions] = await Promise.all([
      getUpcomingSessions(profileId),
      getMenteeCount(profileId),
      getTotalSessionCount(profileId),
      getRecentSessions(profileId)
    ]);

    return (
      <MentorHome
        firstName={user.firstName}
        hasCalendly={!!user.profile.calendlyUser}
        upcomingSessions={upcomingSessions}
        menteeCount={menteeCount}
        totalSessions={totalSessions}
        recentSessions={recentSessions}
      />
    );
  }

  const profileId = user?.profile?.id;
  const [mentorCount, upcomingSessions, totalSessions, recentSessions] = await Promise.all([
    prisma.mentorProfile.count(),
    profileId ? getUpcomingMenteeSessions(profileId) : [],
    profileId ? getTotalSessionCount(profileId) : 0,
    profileId ? getRecentMenteeSessions(profileId) : []
  ]);

  return (
    <MenteeHome
      firstName={user?.firstName}
      mentorCount={mentorCount}
      upcomingSessions={upcomingSessions}
      totalSessions={totalSessions}
      recentSessions={recentSessions}
    />
  );
}
