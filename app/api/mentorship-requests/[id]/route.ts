import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { resend } from '@/lib/email';
import { RequestAcceptedEmail } from '@/lib/emails/request-accepted';
import { type LoggerRequest, withLogger } from '@/lib/with-logger';
import { createClient } from '@/utils/supabase/server';

const updateStatusSchema = z.object({
  status: z.enum(['ACCEPTED', 'DECLINED'])
});

export const PATCH = withLogger(async (req: LoggerRequest, { params }) => {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!data.user || error) {
    return NextResponse.json({ message: 'Unauthorised' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updateStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const mentorUser = await prisma.user.findUnique({
    where: { email: data.user.email },
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

  const updated = await prisma.mentorshipRequest.update({
    where: { id },
    data: { status: 'ACCEPTED' }
  });

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
