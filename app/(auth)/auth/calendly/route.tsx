import { AxiomRequest, withAxiom } from 'next-axiom';
import { NextResponse } from 'next/server';

const { CALENDLY_CLIENT_ID: username, CALENDLY_CLIENT_SECRET: password } = process.env;

export const GET = withAxiom(async ({ log, url }: AxiomRequest) => {
  const { origin, searchParams } = new URL(url);
  const encodedParams = new URLSearchParams();
  encodedParams.set('grant_type', 'authorization_code');
  encodedParams.set('code', searchParams.get('code')!);
  encodedParams.set('redirect_uri', origin + '/auth/calendly');

  try {
    log.info('Fetching access token');

    const response = await fetch('https://auth.calendly.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(username + ':' + password)
      },
      body: encodedParams
    });

    const data = await response.json();

    if (!data.access_token) {
      return NextResponse.json({ message: 'Access token not found' }, { status: 401, statusText: 'Unauthorised' });
    }

    // TODO: Save access and refresh tokens to the database and redirect to the dashboard

    return NextResponse.redirect(origin + '/dashboard/profile', {
      headers: data
    });
  } catch (error) {
    log.error('Error fetching access token', { error });
    return NextResponse.json(
      { message: 'Error fetching access token' },
      { status: 500, statusText: 'Internal Server Error' }
    );
  }
});
