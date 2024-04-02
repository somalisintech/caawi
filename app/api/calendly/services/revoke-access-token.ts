export const revokeAccessToken = async (token: string) => {
  const encodedParams = new URLSearchParams();

  encodedParams.set('client_id', process.env.CALENDLY_CLIENT_ID!);
  encodedParams.set('client_secret', process.env.CALENDLY_CLIENT_SECRET!);
  encodedParams.set('token', token);

  const response = await fetch('https://auth.calendly.com/oauth/revoke', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encodedParams
  });

  return response.json();
};
