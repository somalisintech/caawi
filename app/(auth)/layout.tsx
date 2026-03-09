import type { PropsWithChildren } from 'react';

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-dvh flex-col bg-background py-8 relative">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.4)_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
      />
      <div className="flex flex-1 items-center justify-center relative">
        <div className="container max-w-md">{children}</div>
      </div>
    </div>
  );
}
