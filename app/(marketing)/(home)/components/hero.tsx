import { Globe } from 'lucide-react';
import Link from 'next/link';

export function Hero({ dark }: { dark: boolean }) {
  return (
    <section className="grid grid-cols-[1.2fr_1fr] items-start gap-20 px-[60px] pb-[100px] pt-[60px] max-lg:grid-cols-1 max-lg:gap-10 max-lg:px-10 max-sm:px-6">
      <div>
        <h1 className="mb-[60px] text-[64px] font-bold leading-[1.1] tracking-tight max-sm:text-[40px]">
          caawi. connecting somali professionals through mentorship
        </h1>

        <div className="group inline-flex flex-col gap-2">
          <Link
            href="/auth"
            className={`flex items-center gap-3 text-xl font-medium no-underline ${dark ? 'text-white' : 'text-[#1a1a1a]'}`}
          >
            Join the network
            <span
              className={`inline-block size-2.5 rotate-45 border-r-2 border-t-2 ${
                dark ? 'border-white' : 'border-[#1a1a1a]'
              }`}
            />
          </Link>
          <div className={`relative h-px w-full overflow-hidden ${dark ? 'bg-white/40' : 'bg-black/20'}`}>
            <div
              className={`absolute inset-0 -translate-x-full transition-transform duration-[400ms] group-hover:translate-x-0 ${
                dark ? 'bg-white' : 'bg-[#1a1a1a]'
              }`}
            />
          </div>
        </div>
      </div>

      <div className="pt-2.5">
        <p className={`mb-10 max-w-[480px] text-base leading-relaxed ${dark ? 'text-[#ccc]' : 'text-[#666]'}`}>
          A platform built for the Somali professional community. Find mentors, build connections, and accelerate your
          career through meaningful relationships with engineers, founders, and operators.
        </p>

        <div className="flex gap-5">
          <Link
            href="/auth"
            className={`flex items-center gap-4 rounded-lg border px-3 py-2.5 no-underline transition-all ${
              dark
                ? 'border-white/30 text-white hover:border-white hover:bg-white/10'
                : 'border-black/15 text-[#1a1a1a] hover:border-black/40 hover:bg-black/5'
            }`}
          >
            <Globe className="size-6" />
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] uppercase opacity-70">Become a</span>
              <span className="text-sm font-semibold">Mentor</span>
            </div>
          </Link>
          <Link
            href="/auth"
            className={`flex items-center gap-4 rounded-lg border px-3 py-2.5 no-underline transition-all ${
              dark
                ? 'border-white/30 text-white hover:border-white hover:bg-white/10'
                : 'border-black/15 text-[#1a1a1a] hover:border-black/40 hover:bg-black/5'
            }`}
          >
            <Globe className="size-6" />
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] uppercase opacity-70">Become a</span>
              <span className="text-sm font-semibold">Mentee</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
