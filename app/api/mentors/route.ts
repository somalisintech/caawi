import { AxiomRequest, withAxiom } from 'next-axiom';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const GET = withAxiom(async ({ log }: AxiomRequest) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorised' }, { status: 401, statusText: 'Unauthorised' });
  }

  const mentors = await prisma.mentorProfile.findMany();

  log.debug('Mentor Profiles fetched', {
    mentors
  });

  return NextResponse.json(mentors);
});
