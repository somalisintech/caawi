import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { getServerSession } from 'next-auth';

export default async function Profile() {
  const session = await getServerSession(authOptions);
  return (
    <main className="flex h-full flex-col items-center justify-between pt-10">
      <h1>Profile</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </main>
  );
}
