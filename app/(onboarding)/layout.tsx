import type { PropsWithChildren } from 'react';
import { CaawiLogo } from '@/components/brand/caawi-logo';

export default function OnboardingLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-dvh flex-col bg-linear-to-b from-zinc-50 to-primary/20 dark:from-zinc-950 dark:to-primary/10">
      <div className="container py-6">
        <CaawiLogo />
      </div>
      <div className="flex flex-1 items-center justify-center pb-16">
        <div className="container max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
