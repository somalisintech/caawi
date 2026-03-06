import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { MentorshipRequest } from '@/generated/prisma/client';
import prisma from '@/lib/db';
import { resend } from '@/lib/email';
import { RequestAcceptedEmail } from '@/lib/emails/request-accepted';
import { type LoggerRequest, withLogger } from '@/lib/with-logger';

const updateStatusSchema = z.object({
  status: z.enum(['ACCEPTED', 'DECLINED'])
});

export const PATCH = withLogger(async (req: LoggerRequest, { params }) => {
  const { id } = await params;

  if (!req.user) {
    return NextResponse.json({ message: 'Unauthorised' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updateStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const mentorUser = await prisma.user.findUnique({
    where: { email: req.user.email },
    select: {
      firstName: true,
      lastName: true,
      profile: { select: { id: true, userType: true } }
    }
  });

  if (!mentorUser?.profile || mentorUser.profile.userType !== 'MENTOR') {
    return NextResponse.json({ message: 'Only mentors can manage requests' }, { status: 403 });
  }

  const request = await prisma.mentorshipRequest.findUnique({
    where: { id },
    include: {
      menteeProfile: {
        include: { user: { select: { email: true } } }
      }
    }
  });

  if (!request) {
    return NextResponse.json({ message: 'Request not found' }, { status: 404 });
  }

  if (request.mentorProfileId !== mentorUser.profile.id) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { status } = parsed.data;

  if (status === 'DECLINED') {
    await prisma.mentorshipRequest.update({ where: { id }, data: { status: 'DECLINED' } });
    req.log.debug('Mentorship request declined', { requestId: id });
    return NextResponse.json({ message: 'Request declined' });
  }

  const mentorProfileId = mentorUser.profile.id;

  let updated: MentorshipRequest;
  try {
    updated = await prisma.$transaction(async (tx) => {
      const profile = await tx.profile.findUnique({
        where: { id: mentorProfileId },
        select: { monthlyCapacity: true }
      });

      if (profile?.monthlyCapacity != null) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const acceptedCount = await tx.mentorshipRequest.count({
          where: {
            mentorProfileId,
            status: 'ACCEPTED',
            updatedAt: { gte: startOfMonth }
          }
        });

        if (acceptedCount >= profile.monthlyCapacity) {
          throw new Error('CAPACITY_REACHED');
        }
      }

      return tx.mentorshipRequest.update({
        where: { id },
        data: { status: 'ACCEPTED' }
      });
    });
  } catch (err) {
    if (err instanceof Error && err.message === 'CAPACITY_REACHED') {
      return NextResponse.json({ message: 'Mentee capacity reached' }, { status: 403 });
    }
    throw err;
  }

  const mentorName = [mentorUser.firstName, mentorUser.lastName].filter(Boolean).join(' ') || 'Your mentor';
  const menteeEmail = request.menteeProfile.user.email;

  if (menteeEmail) {
    await resend.emails.send({
      from: 'Caawi <notifications@caawi.com>',
      to: menteeEmail,
      subject: `${mentorName} accepted your mentorship request`,
      react: RequestAcceptedEmail({ mentorName, mentorProfileId: request.mentorProfileId })
    });
  }

  req.log.debug('Mentorship request accepted', { requestId: id });

  return NextResponse.json(updated);
});
