import { logger } from '@/lib/logger';

export const refreshAccessToken = async (refreshToken: string) => {
  const params = new URLSearchParams();
  params.set('grant_type', 'refresh_token');
  params.set('refresh_token', refreshToken);

  logger.info('[calendly:refresh] Refreshing access token');

  const response = await fetch('https://auth.calendly.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${process.env.CALENDLY_CLIENT_ID}:${process.env.CALENDLY_CLIENT_SECRET}`)}`
    },
    body: params
  });

  if (!response.ok) {
    const text = await response.text();
    logger.error('[calendly:refresh] Token refresh failed', { status: response.status, body: text });
    throw new Error(`Calendly token refresh failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  logger.info('[calendly:refresh] Token refreshed successfully');
  return data as { access_token: string; refresh_token: string };
};
