import { NextResponse } from 'next/server';
import { deleteWebhookSubscription, revokeAccessToken } from '@/app/api/calendly/services';
import { decrypt } from '@/lib/crypto';
import prisma from '@/lib/db';
import { type LoggerRequest, withLogger } from '@/lib/with-logger';

export const POST = withLogger(async (req: LoggerRequest) => {
  if (!req.user) {
    return NextResponse.json({ message: 'Unauthorised' }, { status: 401, statusText: 'Unauthorised' });
  }

  req.log.info('Disconnecting Calendly', {
    userId: req.user.id
  });

  const user = await prisma.user.findUnique({
    where: {
      email: req.user.email
    },
    select: {
      id: true,
      profile: {
        select: {
          id: true,
          calendlyUser: true
        }
      }
    }
  });

  const calendlyUser = user?.profile?.calendlyUser;

  let accessToken: string | undefined;
  try {
    accessToken = calendlyUser?.accessToken ? decrypt(calendlyUser.accessToken) : undefined;
  } catch {
    req.log.error('Failed to decrypt access token');
  }

  if (calendlyUser?.webhookUri && accessToken) {
    try {
      await deleteWebhookSubscription(calendlyUser.webhookUri, accessToken);
      req.log.info('Webhook subscription deleted', { webhookUri: calendlyUser.webhookUri });
    } catch (err) {
      req.log.error('Failed to delete webhook subscription', {
        error: err instanceof Error ? err.message : String(err)
      });
    }
  }
  if (accessToken) {
    try {
      await revokeAccessToken(accessToken);
    } catch (err) {
      req.log.error('Failed to revoke access token', {
        error: err instanceof Error ? err.message : String(err)
      });
    }
  }

  if (!calendlyUser) {
    return NextResponse.redirect(`${req.nextUrl.origin}/dashboard/profile`);
  }

  await prisma.calendlyUser.delete({
    where: {
      uri: calendlyUser.uri
    }
  });

  await prisma.profile.update({
    where: { id: user.profile!.id },
    data: { calendlyUserUri: null }
  });

  req.log.info('Calendly disconnected successfully');

  return NextResponse.redirect(`${req.nextUrl.origin}/dashboard/profile`);
});
