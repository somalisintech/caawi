import { NextResponse } from 'next/server';
import {
  createWebhookSubscription,
  deleteWebhookSubscription,
  getAccessToken,
  getCurrentUser
} from '@/app/api/calendly/services';
import { encrypt } from '@/lib/crypto';
import prisma from '@/lib/db';
import { type LoggerRequest, withLogger } from '@/lib/with-logger';

export const GET = withLogger(async (req: LoggerRequest) => {
  try {
    if (!req.user) {
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

    const calendlyFields = {
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
    };

    const user = await prisma.user.findUnique({
      where: { email: req.user.email },
      select: { profile: { select: { id: true, calendlyUserUri: true } } }
    });

    if (!user?.profile) {
      req.log.error('User profile not found', { email: req.user.email });
      return NextResponse.json({ message: 'User profile not found' }, { status: 404 });
    }

    const encryptedAccessToken = encrypt(access_token);
    const encryptedRefreshToken = refresh_token ? encrypt(refresh_token) : null;

    await prisma.calendlyUser.upsert({
      where: { uri },
      create: {
        uri,
        ...calendlyFields,
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        profile: { connect: { id: user.profile.id } }
      },
      update: {
        ...calendlyFields,
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken
      }
    });

    await prisma.profile.update({
      where: { id: user.profile.id },
      data: { calendlyUserUri: uri }
    });

    req.log.info('Stored Calendly tokens in DB', { uri });

    let webhookUri: string | undefined;
    try {
      const result = await createWebhookSubscription({
        accessToken: access_token,
        callbackUrl: `${req.nextUrl.origin}/api/calendly/webhook`,
        organization,
        user: uri
      });
      webhookUri = result.webhookUri;
    } catch (webhookErr) {
      req.log.error('Failed to create webhook subscription', {
        error: webhookErr instanceof Error ? webhookErr.message : String(webhookErr)
      });
    }

    if (webhookUri) {
      try {
        await prisma.calendlyUser.update({
          where: { uri },
          data: { webhookUri }
        });
        req.log.info('Webhook subscription created and stored', { webhookUri });
      } catch (dbErr) {
        req.log.error('Failed to persist webhookUri, cleaning up orphaned subscription', {
          webhookUri,
          error: dbErr instanceof Error ? dbErr.message : String(dbErr)
        });
        try {
          await deleteWebhookSubscription(webhookUri, access_token);
        } catch (cleanupErr) {
          req.log.error('Failed to clean up orphaned webhook subscription', {
            webhookUri,
            error: cleanupErr instanceof Error ? cleanupErr.message : String(cleanupErr)
          });
        }
      }
    }

    req.log.info('Updated user profile with Calendly user data', resource);

    return NextResponse.redirect(`${req.nextUrl.origin}/dashboard/profile`);
  } catch (error) {
    req.log.error('Error fetching access token', { error });
    return NextResponse.json(
      { message: 'Error fetching access token' },
      { status: 500, statusText: 'Internal Server Error' }
    );
  }
});
