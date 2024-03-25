import { AxiomRequest, withAxiom } from 'next-axiom';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import { NextResponse } from 'next/server';
import { revokeAccessToken } from '@/app/api/calendly/services';
import prisma from '@/lib/db';

export const GET = withAxiom(async ({ log, nextUrl, cookies }: AxiomRequest) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.redirect('/api/auth/signin');
  }

  log.info('Disconnecting Calendly', {
    userId: session.user.id
  });

  const calendly_access_token = cookies.get('calendly_access_token')?.value;
  calendly_access_token && (await revokeAccessToken(calendly_access_token));

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

  const response = NextResponse.redirect(nextUrl.origin + '/dashboard/profile');
  response.cookies.delete('calendly_access_token');
  response.cookies.delete('calendly_refresh_token');
  response.cookies.delete('calendly_organization');

  if (!user.profile?.calendlyUser) {
    return response;
  }

  await prisma.calendlyUser.delete({
    where: {
      uri: user.profile.calendlyUser.uri
    }
  });

  return response;
});
