import { AxiomRequest, withAxiom } from 'next-axiom';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/db';

export const GET = withAxiom(async ({ log }: AxiomRequest) => {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ message: 'Unauthorised' }, { status: 401, statusText: 'Unauthorised' });
  }

  const mentors = await prisma.mentorProfile.findMany();

  log.debug('Mentor Profiles fetched', {
    mentors
  });

  return NextResponse.json(mentors);
});
