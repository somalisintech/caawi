import prisma from '@/lib/db';

const menteeUserSelect = {
  menteeProfile: {
    include: {
      user: { select: { firstName: true, lastName: true, image: true, email: true } }
    }
  }
} as const;

const mentorUserSelect = {
  mentorProfile: {
    include: {
      user: { select: { firstName: true, lastName: true, image: true, email: true } }
    }
  }
} as const;

export async function getPendingRequests(mentorProfileId: string) {
  return prisma.mentorshipRequest.findMany({
    where: { mentorProfileId, status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
    include: menteeUserSelect
  });
}

export async function getActiveMentees(mentorProfileId: string) {
  return prisma.mentorshipRequest.findMany({
    where: { mentorProfileId, status: 'ACCEPTED' },
    orderBy: { createdAt: 'desc' },
    include: menteeUserSelect
  });
}

export async function getPendingMentorRequests(menteeProfileId: string) {
  return prisma.mentorshipRequest.findMany({
    where: { menteeProfileId, status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
    include: mentorUserSelect
  });
}

export async function getActiveMentors(menteeProfileId: string) {
  return prisma.mentorshipRequest.findMany({
    where: { menteeProfileId, status: 'ACCEPTED' },
    orderBy: { createdAt: 'desc' },
    include: mentorUserSelect
  });
}

export async function getRequestStatus(menteeProfileId: string, mentorProfileId: string) {
  return prisma.mentorshipRequest.findUnique({
    where: { menteeProfileId_mentorProfileId: { menteeProfileId, mentorProfileId } },
    select: { id: true, status: true }
  });
}

export async function getPendingRequestCount(mentorProfileId: string) {
  return prisma.mentorshipRequest.count({
    where: { mentorProfileId, status: 'PENDING' }
  });
}

export async function getActiveMentorCount(menteeProfileId: string) {
  return prisma.mentorshipRequest.count({
    where: { menteeProfileId, status: 'ACCEPTED' }
  });
}
