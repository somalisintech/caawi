import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { resend } from '@/lib/email';
import { NudgeEmail } from '@/lib/emails/nudge';
import { type LoggerRequest, withLogger } from '@/lib/with-logger';
import { createClient } from '@/utils/supabase/server';

const NUDGE_COOLDOWN_DAYS = 7;

export const POST = withLogger(async (req: LoggerRequest, { params }) => {
  const { id } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!data.user || error) {
    return NextResponse.json({ message: 'Unauthorised' }, { status: 401 });
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
    return NextResponse.json({ message: 'Only mentors can nudge mentees' }, { status: 403 });
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

  if (request.status !== 'ACCEPTED') {
    return NextResponse.json({ message: 'Can only nudge accepted mentees' }, { status: 400 });
  }

  if (request.lastNudgedAt) {
    const daysSinceNudge = (Date.now() - request.lastNudgedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceNudge < NUDGE_COOLDOWN_DAYS) {
      return NextResponse.json(
        { message: 'Nudge cooldown active', cooldownDays: Math.ceil(NUDGE_COOLDOWN_DAYS - daysSinceNudge) },
        { status: 429 }
      );
    }
  }

  const mentorName = [mentorUser.firstName, mentorUser.lastName].filter(Boolean).join(' ') || 'Your mentor';
  const menteeEmail = request.menteeProfile.user.email;

  if (menteeEmail) {
    await resend.emails.send({
      from: 'Caawi <notifications@caawi.com>',
      to: menteeEmail,
      subject: `${mentorName} wants to hear from you`,
      react: NudgeEmail({ mentorName, mentorProfileId: request.mentorProfileId })
    });
  }

  await prisma.mentorshipRequest.update({
    where: { id },
    data: { lastNudgedAt: new Date() }
  });

  req.log.debug('Mentee nudged', { requestId: id });

  return NextResponse.json({ message: 'Nudge sent' });
});
