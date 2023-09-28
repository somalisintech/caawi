import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import TopNav from '@/components/TopNav';
import { redirect } from 'next/navigation';
import { getProfile } from './getProfile';

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const profile = await getProfile(session);

  return (
    <div className="flex h-full flex-col">
      <div className="ml-auto">
        <TopNav />
      </div>
      <div className="overflow-auto p-6">
        <h1 className="text-4xl font-bold">Profile</h1>
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      </div>
    </div>
  );
}
