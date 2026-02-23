import { NextResponse } from 'next/server';
import { type AxiomRequest, withAxiom } from 'next-axiom';

export const GET = withAxiom(async (req: AxiomRequest) => {
  const { origin } = new URL(req.url);
  const calendlyUrl = new URL('https://auth.calendly.com/oauth/authorize');

  calendlyUrl.searchParams.set('client_id', process.env.CALENDLY_CLIENT_ID!);
  calendlyUrl.searchParams.set('redirect_uri', `${origin}/api/calendly/callback`);
  calendlyUrl.searchParams.set('response_type', 'code');

  return NextResponse.redirect(calendlyUrl);
});
