import { PropsWithChildren } from 'react';

export default function ErrorLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-b from-zinc-50 to-primary/20 py-8 dark:from-zinc-950 dark:to-primary/10">
      <div className="flex flex-1 items-center justify-center">
        <div className="container max-w-md">{children}</div>
      </div>
    </div>
  );
}
