import { headers } from 'next/headers';

const url = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `${process.env.NEXTAUTH_URL}`;

export async function getProfile() {
  const response = await fetch(url + '/api/me', {
    headers: headers()
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
}
