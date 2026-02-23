type Props = {
  grantType: string;
  code: string;
  redirectUri: string;
};

export const getAccessToken = async ({ grantType, code, redirectUri }: Props) => {
  const encodedParams = new URLSearchParams();

  encodedParams.set('grant_type', grantType);
  encodedParams.set('code', code);
  encodedParams.set('redirect_uri', redirectUri);

  const response = await fetch('https://auth.calendly.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${process.env.CALENDLY_CLIENT_ID}:${process.env.CALENDLY_CLIENT_SECRET}`)}`
    },
    body: encodedParams
  });

  return await response.json();
};
