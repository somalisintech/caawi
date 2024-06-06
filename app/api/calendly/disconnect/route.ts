import { AxiomRequest, withAxiom } from 'next-axiom';
import { NextResponse } from 'next/server';
import { revokeAccessToken } from '@/app/api/calendly/services';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/db';

export const GET = withAxiom(async (req: AxiomRequest) => {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.redirect('/api/auth/signin');
  }

  req.log.info('Disconnecting Calendly', {
    userId: userData.user.id
  });

  const calendly_access_token = req.cookies.get('calendly_access_token')?.value;
  calendly_access_token && (await revokeAccessToken(calendly_access_token));

  const user = await prisma.user.findUnique({
    where: {
      id: userData.user.id
    },
    select: {
      profile: {
        select: {
          calendlyUser: true
        }
      }
    }
  });

  const response = NextResponse.redirect(req.nextUrl.origin + '/dashboard/profile');
  response.cookies.delete('calendly_access_token');
  response.cookies.delete('calendly_refresh_token');
  response.cookies.delete('calendly_organization');

  if (!user?.profile?.calendlyUser) {
    return response;
  }

  await prisma.calendlyUser.delete({
    where: {
      uri: user.profile.calendlyUser.uri
    }
  });

  return response;
});
