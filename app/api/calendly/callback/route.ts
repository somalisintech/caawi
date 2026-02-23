import { AxiomRequest, withAxiom } from 'next-axiom';
import { NextResponse } from 'next/server';
import { getAccessToken, getCurrentUser } from '@/app/api/calendly/services';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/db';

export const GET = withAxiom(async (req: AxiomRequest) => {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      return NextResponse.json({ message: 'Unauthorised' }, { status: 401, statusText: 'Unauthorised' });
    }

    req.log.info('Fetching access token');

    const { access_token, refresh_token, organization } = await getAccessToken({
      grantType: 'authorization_code',
      code: req.nextUrl.searchParams.get('code')!,
      redirectUri: req.nextUrl.origin + '/api/calendly/callback'
    });

    if (!access_token) {
      req.log.info('Access token not found');
      return NextResponse.json({ message: 'Access token not found' }, { status: 401, statusText: 'Unauthorised' });
    }

    const { resource } = await getCurrentUser(access_token);

    await prisma.user.update({
      where: {
        email: data.user.email
      },
      data: {
        profile: {
          update: {
            calendlyUserUri: resource.uri,
            calendlyUser: {
              create: resource
            }
          }
        }
      }
    });

    req.log.info('Updated user profile with Calendly user data', resource);

    const response = NextResponse.redirect(req.nextUrl.origin + '/dashboard/profile');
    response.cookies.set('calendly_access_token', access_token);
    response.cookies.set('calendly_refresh_token', refresh_token);
    response.cookies.set('calendly_organization', organization);

    return response;
  } catch (error) {
    req.log.error('Error fetching access token', { error });
    return NextResponse.json(
      { message: 'Error fetching access token' },
      { status: 500, statusText: 'Internal Server Error' }
    );
  }
});
