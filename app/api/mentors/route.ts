import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { type LoggerRequest, withLogger } from '@/lib/with-logger';
import { createClient } from '@/utils/supabase/server';

export const GET = withLogger(async (req: LoggerRequest) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!data.user || error) {
    return NextResponse.json({ message: 'Unauthorised' }, { status: 401, statusText: 'Unauthorised' });
  }

  const mentors = await prisma.mentorProfile.findMany();

  req.log.debug('Mentor Profiles fetched', {
    mentors
  });

  return NextResponse.json(mentors);
});
