import { PropsWithChildren } from 'react';
import Image from 'next/image';

export default function AuthTemplate({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-full">
      <div className="flex flex-1 flex-col items-center justify-center lg:flex-row lg:justify-stretch">
        <div className="p-6 lg:p-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">{children}</div>
        </div>
        <div className="relative hidden size-full lg:block">
          <Image
            priority
            fill
            className="object-cover"
            src="/auth-bg.jpg"
            alt="Cover photo"
            sizes="(min-width: 1280px) 1280px, 100vw"
          />
        </div>
      </div>
    </div>
  );
}
