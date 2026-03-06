import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { type LoggerRequest, withLogger } from '@/lib/with-logger';

export const GET = withLogger(async (req: LoggerRequest) => {
  if (!req.user) {
    return NextResponse.json({ message: 'Unauthorised' }, { status: 401, statusText: 'Unauthorised' });
  }

  const mentors = await prisma.mentorProfile.findMany();

  req.log.debug('Mentor Profiles fetched', {
    mentors
  });

  return NextResponse.json(mentors);
});
