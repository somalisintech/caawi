const { CALENDLY_CLIENT_ID, CALENDLY_CLIENT_SECRET } = process.env;

if (!CALENDLY_CLIENT_ID || !CALENDLY_CLIENT_SECRET) {
  throw new Error('CALENDLY_CLIENT_ID and CALENDLY_CLIENT_SECRET must be provided');
}

export const revokeAccessToken = async (token: string) => {
  const encodedParams = new URLSearchParams();

  encodedParams.set('client_id', CALENDLY_CLIENT_ID);
  encodedParams.set('client_secret', CALENDLY_CLIENT_SECRET);
  encodedParams.set('token', token);

  const response = await fetch('https://auth.calendly.com/oauth/revoke', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encodedParams
  });

  return response.json();
};
