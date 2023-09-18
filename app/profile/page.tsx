import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import TopNav from '@/components/TopNav';
import { redirect } from 'next/navigation';

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <main>
      <div className="flex flex-col items-center justify-between p-24">
        <TopNav />
        <h1 className="text-4xl font-bold">Profile</h1>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
    </main>
  );
}
