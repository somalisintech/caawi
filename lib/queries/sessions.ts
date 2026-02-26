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
