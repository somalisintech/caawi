import { AxiomRequest, withAxiom } from 'next-axiom';
import { NextResponse } from 'next/server';
import { getAccessToken, getCurrentUser } from '@/app/api/calendly/services';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/db';

export const GET = withAxiom(async ({ log, nextUrl }: AxiomRequest) => {
  try {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return NextResponse.json({ message: 'Unauthorised' }, { status: 401, statusText: 'Unauthorised' });
    }

    log.info('Fetching access token');

    const data = await getAccessToken({
      grantType: 'authorization_code',
      code: nextUrl.searchParams.get('code')!,
      redirectUri: nextUrl.origin + '/api/calendly/callback'
    });

    if (!data.access_token) {
      log.info('Access token not found');
      return NextResponse.json({ message: 'Access token not found' }, { status: 401, statusText: 'Unauthorised' });
    }

    const { resource } = await getCurrentUser(data.access_token);

    await prisma.user.update({
      where: {
        id: userData.user.id
      },
      data: {
        profile: {
          update: {
            calendlyUser: {
              upsert: {
                create: resource,
                update: resource
              }
            }
          }
        }
      }
    });

    log.info('Updated user profile with Calendly user data', resource);

    const response = NextResponse.redirect(nextUrl.origin + '/dashboard/profile');
    response.cookies.set('calendly_access_token', data.access_token);
    response.cookies.set('calendly_refresh_token', data.refresh_token);
    response.cookies.set('calendly_organization', data.organization);

    return response;
  } catch (error) {
    log.error('Error fetching access token', { error });
    return NextResponse.json(
      { message: 'Error fetching access token' },
      { status: 500, statusText: 'Internal Server Error' }
    );
  }
});
