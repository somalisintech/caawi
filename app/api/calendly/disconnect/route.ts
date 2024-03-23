import { AxiomRequest, withAxiom } from 'next-axiom';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/authOptions';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';

export const GET = withAxiom(async ({ log, url }: AxiomRequest) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.redirect('/api/auth/signin');
  }

  log.info('Disconnecting Calendly', {
    userId: session.user.id
  });

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: session.user.id
    },
    select: {
      profile: {
        select: {
          calendlyUser: true
        }
      }
    }
  });

  const callbackUrl = new URL('/dashboard/profile', url);

  if (!user.profile?.calendlyUser) {
    return NextResponse.redirect(callbackUrl);
  }

  const calendlyUser = await prisma.calendlyUser.delete({
    where: {
      uri: user.profile.calendlyUser.uri
    }
  });

  log.info('Calendly user disconnected', {
    calendlyUser
  });

  return NextResponse.redirect(callbackUrl);
});
