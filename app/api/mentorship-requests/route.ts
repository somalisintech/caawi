import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { type LoggerRequest, withLogger } from '@/lib/with-logger';
import { createClient } from '@/utils/supabase/server';

const createRequestSchema = z.object({
  mentorProfileId: z.string().uuid(),
  message: z.string().min(10).max(500)
});

export const POST = withLogger(async (req: LoggerRequest) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!data.user || error) {
    return NextResponse.json({ message: 'Unauthorised' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const { mentorProfileId, message } = parsed.data;

  const menteeUser = await prisma.user.findUnique({
    where: { email: data.user.email },
    select: {
      profile: {
        select: { id: true, userType: true, gender: true }
      }
    }
  });

  if (!menteeUser?.profile) {
    return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
  }

  const menteeProfile = menteeUser.profile;

  if (menteeProfile.userType !== 'MENTEE') {
    return NextResponse.json({ message: 'Only mentees can send requests' }, { status: 403 });
  }

  const mentorProfile = await prisma.profile.findUnique({
    where: { id: mentorProfileId },
    select: { id: true, userType: true, gender: true, sameGenderPref: true }
  });

  if (!mentorProfile || mentorProfile.userType !== 'MENTOR') {
    return NextResponse.json({ message: 'Mentor not found' }, { status: 404 });
  }

  if (mentorProfile.sameGenderPref && mentorProfile.gender !== menteeProfile.gender) {
    return NextResponse.json({ message: 'This mentor only accepts same-gender mentees' }, { status: 403 });
  }

  // Delete existing DECLINED request so mentee can re-request
  await prisma.mentorshipRequest.deleteMany({
    where: {
      menteeProfileId: menteeProfile.id,
      mentorProfileId,
      status: 'DECLINED'
    }
  });

  // Check for existing PENDING/ACCEPTED request
  const existing = await prisma.mentorshipRequest.findUnique({
    where: {
      menteeProfileId_mentorProfileId: {
        menteeProfileId: menteeProfile.id,
        mentorProfileId
      }
    }
  });

  if (existing) {
    return NextResponse.json({ message: 'Request already exists' }, { status: 409 });
  }

  const request = await prisma.mentorshipRequest.create({
    data: {
      menteeProfileId: menteeProfile.id,
      mentorProfileId,
      message
    }
  });

  req.log.debug('Mentorship request created', { requestId: request.id });

  return NextResponse.json(request, { status: 201 });
});
