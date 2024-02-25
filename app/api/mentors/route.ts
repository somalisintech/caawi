import { AxiomRequest, withAxiom } from 'next-axiom';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const GET = withAxiom(async ({ log }: AxiomRequest) => {
  const mentors = await prisma.mentorProfile.findMany();

  log.debug('Mentor Profiles fetched', {
    mentors
  });

  return NextResponse.json(mentors);
});
