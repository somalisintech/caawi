import { NextResponse } from 'next/server';
import { type LoggerRequest, withLogger } from '@/lib/with-logger';

export const GET = withLogger(async (req: LoggerRequest) => {
  const { origin } = new URL(req.url);
  const calendlyUrl = new URL('https://auth.calendly.com/oauth/authorize');

  calendlyUrl.searchParams.set('client_id', process.env.CALENDLY_CLIENT_ID!);
  calendlyUrl.searchParams.set('redirect_uri', `${origin}/api/calendly/callback`);
  calendlyUrl.searchParams.set('response_type', 'code');

  return NextResponse.redirect(calendlyUrl);
});
