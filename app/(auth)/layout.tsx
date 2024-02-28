import { PropsWithChildren } from 'react';

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-b from-zinc-50 to-primary/20 py-8">
      <div className="flex flex-1 items-center justify-center">
        <div className="container max-w-md">{children}</div>
      </div>
    </div>
  );
}
