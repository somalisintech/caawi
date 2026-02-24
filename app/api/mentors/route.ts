import { NextResponse } from 'next/server';
import { type AxiomRequest, withAxiom } from 'next-axiom';
import prisma from '@/lib/db';
import { createClient } from '@/utils/supabase/server';

export const GET = withAxiom(async (req: AxiomRequest) => {
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
