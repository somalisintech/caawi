import prisma from '@/lib/db';

/** Past sessions where the user hasn't submitted feedback yet (max 5). */
export async function getSessionsAwaitingFeedback(profileId: string, userId: string, userType: 'MENTOR' | 'MENTEE') {
  const profileFilter = userType === 'MENTOR' ? { mentorProfileId: profileId } : { menteeProfileId: profileId };

  return prisma.session.findMany({
    where: {
      ...profileFilter,
      status: 'ACTIVE',
      endTime: { lt: new Date() },
      feedback: { none: { authorId: userId } }
    },
    orderBy: { endTime: 'desc' },
    take: 5,
    include: {
      mentorProfile: { include: { user: { select: { firstName: true, lastName: true, image: true } } } },
      menteeProfile: { include: { user: { select: { firstName: true, lastName: true, image: true } } } }
    }
  });
}
