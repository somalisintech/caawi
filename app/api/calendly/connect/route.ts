import { NextResponse } from 'next/server';
import { type LoggerRequest, withLogger } from '@/lib/with-logger';
import { getUrl } from '@/utils/url';

export const GET = withLogger(async (_req: LoggerRequest) => {
  const calendlyUrl = new URL('https://auth.calendly.com/oauth/authorize');

  calendlyUrl.searchParams.set('client_id', process.env.CALENDLY_CLIENT_ID!);
  calendlyUrl.searchParams.set('redirect_uri', `${getUrl()}/api/calendly/callback`);
  calendlyUrl.searchParams.set('response_type', 'code');

  return NextResponse.redirect(calendlyUrl);
});
