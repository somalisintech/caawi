export const getUrl = () => {
  let url = process?.env?.NEXT_PUBLIC_VERCEL_URL ?? 'http://localhost:3000';
  url = url.includes('http') ? url : `https://${url}`;
  url = url.replace(/\/$/, '');
  return url;
};
