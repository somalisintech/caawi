import { AxiomRequest, withAxiom } from 'next-axiom';
import { NextResponse } from 'next/server';
import { revokeAccessToken } from '@/app/api/calendly/services';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/db';

export const GET = withAxiom(async (req: AxiomRequest) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!data.user || error) {
    return NextResponse.json({ message: 'Unauthorised' }, { status: 401, statusText: 'Unauthorised' });
  }

  req.log.info('Disconnecting Calendly', {
    userId: data.user.id
  });

  const calendly_access_token = req.cookies.get('calendly_access_token')?.value;
  calendly_access_token && (await revokeAccessToken(calendly_access_token));

  const user = await prisma.user.findUnique({
    where: {
      email: data.user.email
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
