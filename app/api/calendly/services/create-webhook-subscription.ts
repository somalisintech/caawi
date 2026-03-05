import { logger } from '@/lib/logger';

type Props = {
  accessToken: string;
  callbackUrl: string;
  organization: string;
  user: string;
};

export const createWebhookSubscription = async ({ accessToken, callbackUrl, organization, user }: Props) => {
  const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
  if (!signingKey) {
    throw new Error('CALENDLY_WEBHOOK_SIGNING_KEY env var not set');
  }

  logger.info('[calendly:webhook] Creating webhook subscription', { callbackUrl, organization, user });

  const response = await fetch('https://api.calendly.com/webhook_subscriptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      url: callbackUrl,
      events: ['invitee.created', 'invitee.canceled'],
      organization,
      user,
      scope: 'user',
      signing_key: signingKey
    })
  });

  if (!response.ok) {
    const text = await response.text();
    logger.error('[calendly:webhook] Subscription creation failed', { status: response.status, body: text });
    throw new Error(`Calendly webhook subscription failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const webhookUri = data.resource.uri as string;
  logger.info('[calendly:webhook] Subscription created', { webhookUri });
  return { webhookUri };
};
