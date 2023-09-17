import Image from 'next/image';
import Link from 'next/link';

export const CaawiLogo = () => {
  return (
    <Link href={'/'}>
      <Image src="/icon.svg" alt="logo" width={40} height={40} />
    </Link>
  );
};
