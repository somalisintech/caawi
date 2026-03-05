import { NextResponse } from 'next/server';
import { deleteWebhookSubscription, revokeAccessToken } from '@/app/api/calendly/services';
import { decrypt } from '@/lib/crypto';
import prisma from '@/lib/db';
import { type LoggerRequest, withLogger } from '@/lib/with-logger';
import { createClient } from '@/utils/supabase/server';

export const POST = withLogger(async (req: LoggerRequest) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!data.user || error) {
    return NextResponse.json({ message: 'Unauthorised' }, { status: 401, statusText: 'Unauthorised' });
  }

  req.log.info('Disconnecting Calendly', {
    userId: data.user.id
  });

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

  const calendlyUser = user?.profile?.calendlyUser;

  let accessToken: string | undefined;
  try {
    accessToken = calendlyUser?.accessToken ? decrypt(calendlyUser.accessToken) : undefined;
  } catch {
    req.log.error('Failed to decrypt access token, falling back to cookie');
  }
  accessToken ??= req.cookies.get('calendly_access_token')?.value;

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
    await revokeAccessToken(accessToken);
  }

  const response = NextResponse.redirect(`${req.nextUrl.origin}/dashboard/profile`);
  response.cookies.delete('calendly_access_token');
  response.cookies.delete('calendly_refresh_token');
  response.cookies.delete('calendly_organization');

  if (!calendlyUser) {
    return response;
  }

  await prisma.calendlyUser.delete({
    where: {
      uri: calendlyUser.uri
    }
  });

  req.log.info('Calendly disconnected successfully');

  return response;
});
