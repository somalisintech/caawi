import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const CaawiLogo = ({ className }: { className?: string }) => {
  return (
    <Button variant="link" asChild size={'icon'} className={cn(className)}>
      <Link href={'/'}>
        <Image src="/icon.svg" alt="logo" width={40} height={40} />
      </Link>
    </Button>
  );
};
