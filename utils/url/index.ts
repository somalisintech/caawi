const DEFAULT_REDIRECT = '/dashboard/profile';

/**
 * Validates a redirect path to prevent open redirects.
 * Rejects paths starting with //, containing ://, or not starting with /.
 */
export function validateRedirectPath(path: string | null): string {
  if (!path || !path.startsWith('/') || path.startsWith('//') || path.includes('://')) {
    return DEFAULT_REDIRECT;
  }
  return path;
}

export const getUrl = () => {
  let url = process?.env?.NEXT_PUBLIC_SITE_URL ?? process?.env?.NEXT_PUBLIC_VERCEL_URL ?? 'http://localhost:3000';
  url = url.includes('http') ? url : `https://${url}`;
  url = url.replace(/\/$/, '');
  return url;
};
