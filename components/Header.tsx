import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LoginButton from '@/components/buttons/LoginButton';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <Link href="/">
        <Button>Caawi</Button>
      </Link>
      <nav>
        <ul className="flex justify-evenly">
          <li>
            <Link href="/">
              <Button variant={'ghost'} size={'lg'}>
                Home
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/profile">
              <Button variant={'ghost'} size={'lg'}>
                Profile
              </Button>
            </Link>
          </li>
          <li>
            <LoginButton />
          </li>
          <li>
            <Link href="/signup">
              <Button variant={'ghost'} size={'lg'}>
                Sign Up
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
