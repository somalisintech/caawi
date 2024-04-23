export function getUrl() {
  return process.env.NODE_ENV === 'production'
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : `http://localhost:3000`;
}
