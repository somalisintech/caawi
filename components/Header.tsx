import Link from 'next/link';
import { Button } from '@/components/ui/button';
import TopNav from '@/components/TopNav';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="flex items-center justify-between p-4">
      <Link href="/">
        <Button>Caawi</Button>
      </Link>
      <nav>
        <ul className="flex justify-evenly">
          {session && (
            <li>
              <Link href="/profile">
                <Button variant="ghost" size="lg">
                  Profile
                </Button>
              </Link>
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
