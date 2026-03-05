import { logger } from '@/lib/logger';

export const deleteWebhookSubscription = async (webhookUri: string, accessToken: string) => {
  logger.info('[calendly:webhook] Deleting webhook subscription', { webhookUri });

  const response = await fetch(webhookUri, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok && response.status !== 404) {
    const text = await response.text();
    logger.error('[calendly:webhook] Subscription deletion failed', { status: response.status, body: text });
    throw new Error(`Calendly webhook deletion failed: ${response.status} ${response.statusText}`);
  }

  logger.info('[calendly:webhook] Subscription deleted');
};
