import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';

export function CaawiLogo({ className, ...rest }: ButtonProps) {
  return (
    <Button variant="link" asChild size="icon" className={cn(className)} {...rest}>
      <Link href="/">
        <Image src="/icon.svg" alt="logo" width={40} height={40} />
      </Link>
    </Button>
  );
}
