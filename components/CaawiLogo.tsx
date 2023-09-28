import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const CaawiLogo = () => {
  return (
    <Button variant="link" asChild size={'icon'}>
      <Link href={'/'}>
        <Image src="/icon.svg" alt="logo" width={40} height={40} />
      </Link>
    </Button>
  );
};
