import prisma from '@/lib/db';

export async function getUpcomingSessions(profileId: string) {
  return prisma.session.findMany({
    where: {
      mentorProfileId: profileId,
      status: 'ACTIVE',
      startTime: { gt: new Date() }
    },
    orderBy: { startTime: 'asc' },
    include: {
      menteeProfile: {
        include: {
          user: { select: { firstName: true, lastName: true, image: true } }
        }
      }
    }
  });
}

export async function getUpcomingMenteeSessions(profileId: string) {
  return prisma.session.findMany({
    where: {
      menteeProfileId: profileId,
      status: 'ACTIVE',
      startTime: { gt: new Date() }
    },
    orderBy: { startTime: 'asc' },
    include: {
      mentorProfile: {
        include: {
          user: { select: { firstName: true, lastName: true, image: true } }
        }
      }
    }
  });
}

export async function getMenteeCount(profileId: string) {
  const result = await prisma.session.findMany({
    where: { mentorProfileId: profileId, status: 'ACTIVE' },
    select: { menteeProfileId: true },
    distinct: ['menteeProfileId']
  });
  return result.length;
}

export async function getTotalSessionCount(profileId: string) {
  return prisma.session.count({
    where: {
      OR: [{ mentorProfileId: profileId }, { menteeProfileId: profileId }],
      status: 'ACTIVE',
      startTime: { lt: new Date() }
    }
  });
}

export async function getRecentSessions(profileId: string, limit = 5) {
  return prisma.session.findMany({
    where: {
      mentorProfileId: profileId,
      status: 'ACTIVE',
      startTime: { lt: new Date() }
    },
    orderBy: { startTime: 'desc' },
    take: limit,
    include: {
      menteeProfile: {
        include: {
          user: { select: { firstName: true, lastName: true, image: true } }
        }
      }
    }
  });
}

export async function getSessionsForRange(profileId: string, userType: 'MENTOR' | 'MENTEE', start: Date, end: Date) {
  const profileFilter = userType === 'MENTOR' ? { mentorProfileId: profileId } : { menteeProfileId: profileId };

  return prisma.session.findMany({
    where: {
      ...profileFilter,
      startTime: { gte: start, lt: end }
    },
    orderBy: { startTime: 'asc' },
    include: {
      mentorProfile: {
        include: {
          user: { select: { firstName: true, lastName: true, image: true } }
        }
      },
      menteeProfile: {
        include: {
          user: { select: { firstName: true, lastName: true, image: true } }
        }
      }
    }
  });
}

export async function getRecentMenteeSessions(profileId: string, limit = 5) {
  return prisma.session.findMany({
    where: {
      menteeProfileId: profileId,
      status: 'ACTIVE',
      startTime: { lt: new Date() }
    },
    orderBy: { startTime: 'desc' },
    take: limit,
    include: {
      mentorProfile: {
        include: {
          user: { select: { firstName: true, lastName: true, image: true } }
        }
      }
    }
  });
}
