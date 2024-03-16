import { AxiomRequest, withAxiom } from 'next-axiom';
import { NextResponse } from 'next/server';

const { CALENDLY_CLIENT_ID } = process.env;

export const GET = withAxiom(async ({ url }: AxiomRequest) => {
  const { origin } = new URL(url);
  const calendlyUrl = new URL('https://auth.calendly.com/oauth/authorize');
  calendlyUrl.searchParams.set('client_id', CALENDLY_CLIENT_ID!);
  calendlyUrl.searchParams.set('redirect_uri', origin + '/api/auth/calendly/callback');
  calendlyUrl.searchParams.set('response_type', 'code');

  return NextResponse.redirect(calendlyUrl);
});
