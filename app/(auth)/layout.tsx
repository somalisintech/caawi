import { PropsWithChildren } from 'react';

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-dvh bg-gradient-to-b from-zinc-50 to-primary/20">
      <div className="flex flex-1 items-center justify-center">
        <div className="container max-w-lg">{children}</div>
      </div>
    </div>
  );
}
