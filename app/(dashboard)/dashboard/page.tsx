import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { FeedbackPrompt } from '@/components/dashboard/feedback/feedback-prompt';
import { MenteeHome } from '@/components/dashboard/mentee-home';
import { MentorHome } from '@/components/dashboard/mentor-home';
import prisma from '@/lib/db';
import { getSessionsAwaitingFeedback } from '@/lib/queries/feedback';
import { getPendingRequestCount } from '@/lib/queries/mentorship-requests';
import {
  getMenteeCount,
  getRecentMenteeSessions,
  getRecentSessions,
  getTotalSessionCount,
  getUpcomingMenteeSessions,
  getUpcomingSessions
} from '@/lib/queries/sessions';
import { createClient } from '@/utils/supabase/server';
import DashboardLoading from './loading';

export default function DashboardHomePage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
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
    const [upcomingSessions, menteeCount, totalSessions, recentSessions, pendingRequestCount, awaitingFeedback] =
      await Promise.all([
        getUpcomingSessions(profileId),
        getMenteeCount(profileId),
        getTotalSessionCount(profileId),
        getRecentSessions(profileId),
        getPendingRequestCount(profileId),
        getSessionsAwaitingFeedback(profileId, data.user.id, 'MENTOR')
      ]);

    const feedbackSessions = awaitingFeedback.map((s) => ({
      id: s.id,
      eventName: s.eventName,
      endTime: s.endTime.toISOString(),
      counterpart: s.menteeProfile.user
    }));

    return (
      <>
        <FeedbackPrompt sessions={feedbackSessions} />
        <MentorHome
          firstName={user.firstName}
          hasCalendly={!!user.profile.calendlyUser}
          upcomingSessions={upcomingSessions}
          menteeCount={menteeCount}
          totalSessions={totalSessions}
          recentSessions={recentSessions}
          pendingRequestCount={pendingRequestCount}
        />
      </>
    );
  }

  const profileId = user?.profile?.id;
  const [mentorCount, upcomingSessions, totalSessions, recentSessions, awaitingFeedback] = await Promise.all([
    prisma.mentorProfile.count(),
    profileId ? getUpcomingMenteeSessions(profileId) : [],
    profileId ? getTotalSessionCount(profileId) : 0,
    profileId ? getRecentMenteeSessions(profileId) : [],
    profileId ? getSessionsAwaitingFeedback(profileId, data.user.id, 'MENTEE') : []
  ]);

  const feedbackSessions = awaitingFeedback.map((s) => ({
    id: s.id,
    eventName: s.eventName,
    endTime: s.endTime.toISOString(),
    counterpart: s.mentorProfile.user
  }));

  return (
    <>
      <FeedbackPrompt sessions={feedbackSessions} />
      <MenteeHome
        firstName={user?.firstName}
        mentorCount={mentorCount}
        upcomingSessions={upcomingSessions}
        totalSessions={totalSessions}
        recentSessions={recentSessions}
      />
    </>
  );
}
