import Link from 'next/link';
import { Button } from '@/components/ui/button';
import TopNav from '@/components/TopNav';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/authOptions';

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="flex items-center justify-between p-4">
      <Button asChild>
        <Link href="/">Caawi</Link>
      </Button>
      <nav>
        <ul className="flex justify-evenly">
          {session && (
            <li>
              <Button variant="ghost" size="lg" asChild>
                <Link href="/profile">Profile</Link>
              </Button>
            </li>
          )}
          <li>
            <TopNav />
          </li>
        </ul>
      </nav>
    </header>
  );
}
