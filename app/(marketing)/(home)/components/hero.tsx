import { Compass, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="grid grid-cols-[1.2fr_1fr] items-start gap-20 px-[60px] pb-24 pt-12 max-lg:grid-cols-1 max-lg:gap-10 max-lg:px-10 max-sm:px-6">
      <div>
        <h1 className="mb-12 text-[64px] font-bold leading-[1.05] tracking-tight max-sm:text-[40px]">
          connecting somali professionals through mentorship.
        </h1>

        <Link
          href="/auth"
          className="group inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-3 text-base font-medium text-background no-underline transition-all hover:gap-4"
        >
          Join the network
          <span className="inline-block size-2.5 rotate-45 border-r-2 border-t-2 border-current transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="pt-3">
        <p className="mb-10 max-w-[480px] text-lg leading-relaxed text-muted-foreground">
          A platform built for the Somali professional community. Find mentors, build connections, and accelerate your
          career through meaningful relationships with engineers, founders, and operators.
        </p>

        <div className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Or join as</div>
        <div className="flex gap-3">
          <RoleTile href="/auth" icon={<Sparkles className="size-5 shrink-0" strokeWidth={1.75} />} label="Mentor" />
          <RoleTile href="/auth" icon={<Compass className="size-5 shrink-0" strokeWidth={1.75} />} label="Mentee" />
        </div>
      </div>
    </section>
  );
}

function RoleTile({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-1 items-center gap-3 rounded-xl border border-border bg-card/40 px-4 py-3 no-underline transition-all hover:-translate-y-0.5 hover:border-foreground/40 hover:bg-card"
    >
      {icon}
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-wider opacity-60">Become a</span>
        <span className="text-sm font-semibold">{label}</span>
      </div>
    </Link>
  );
}
