import type { PropsWithChildren } from 'react';

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-dvh flex-col bg-background py-8">
      <div className="flex flex-1 items-center justify-center">
        <div className="container max-w-md">{children}</div>
      </div>
    </div>
  );
}
