import { getServerSession } from 'next-auth';
export async function GET() {
  const session = await getServerSession();
  if (session && session.user) {
    return new Response(JSON.stringify(session.user));
  }

  return new Response('Unauthorized', { status: 401 });
}
