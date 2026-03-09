import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn('mt-auto py-10', className)}>
      <div className="mb-6 h-px bg-border" />
      <div className="flex items-center justify-between max-sm:flex-col max-sm:gap-4">
        <div className="flex items-center gap-6">
          <div className="text-lg font-extrabold tracking-tight">caawi.</div>
          <Link
            href="mailto:hello@caawi.org"
            className="text-sm text-muted-foreground transition-opacity hover:opacity-100"
          >
            hello@caawi.org
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Somalis in Tech</span>
          <Link
            href="/privacy-policy"
            className="text-sm text-muted-foreground underline transition-opacity hover:opacity-100"
          >
            Privacy
          </Link>
          <Link
            href="/terms-and-conditions"
            className="text-sm text-muted-foreground underline transition-opacity hover:opacity-100"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
