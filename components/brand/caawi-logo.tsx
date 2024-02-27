import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';

type Props = ButtonProps & {
  width?: number;
  height?: number;
};

export function CaawiLogo({ className, width = 40, height = 40, ...rest }: Props) {
  return (
    <Button variant="link" asChild size="icon" className={cn(className)} {...rest}>
      <Link href="/">
        <Image src="/icon.svg" alt="logo" width={width} height={height} />
      </Link>
    </Button>
  );
}
