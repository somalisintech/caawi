import { NextResponse } from 'next/server';
import { getAccessToken, getCurrentUser } from '@/app/api/calendly/services';
import prisma from '@/lib/db';
import { type LoggerRequest, withLogger } from '@/lib/with-logger';
import { createClient } from '@/utils/supabase/server';

export const GET = withLogger(async (req: LoggerRequest) => {
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
      redirectUri: `${req.nextUrl.origin}/api/calendly/callback`
    });

    if (!access_token) {
      req.log.info('Access token not found');
      return NextResponse.json({ message: 'Access token not found' }, { status: 401, statusText: 'Unauthorised' });
    }

    const { resource } = await getCurrentUser(access_token);

    const {
      uri,
      name,
      slug,
      email: calendlyEmail,
      scheduling_url,
      timezone,
      avatar_url,
      created_at,
      updated_at,
      current_organization,
      resource_type
    } = resource;

    await prisma.user.update({
      where: {
        email: data.user.email
      },
      data: {
        profile: {
          update: {
            calendlyUserUri: uri,
            calendlyUser: {
              create: {
                uri,
                name,
                slug,
                email: calendlyEmail,
                scheduling_url,
                timezone,
                avatar_url,
                created_at,
                updated_at,
                current_organization,
                resource_type
              }
            }
          }
        }
      }
    });

    req.log.info('Updated user profile with Calendly user data', resource);

    const response = NextResponse.redirect(`${req.nextUrl.origin}/dashboard/profile`);
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/'
    };
    response.cookies.set('calendly_access_token', access_token, cookieOptions);
    response.cookies.set('calendly_refresh_token', refresh_token, cookieOptions);
    response.cookies.set('calendly_organization', organization, cookieOptions);

    return response;
  } catch (error) {
    req.log.error('Error fetching access token', { error });
    return NextResponse.json(
      { message: 'Error fetching access token' },
      { status: 500, statusText: 'Internal Server Error' }
    );
  }
});
