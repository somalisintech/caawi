import Link from 'next/link';

export function LandingFooter({ dark }: { dark: boolean }) {
  const muted = dark ? 'text-white/50' : 'text-black/40';

  return (
    <footer className={`mt-auto px-[60px] py-10 max-lg:px-10 max-sm:px-6 ${dark ? 'text-white' : 'text-[#1a1a1a]'}`}>
      <div className={`mb-6 h-px ${dark ? 'bg-white/10' : 'bg-black/10'}`} />
      <div className="flex items-center justify-between max-sm:flex-col max-sm:gap-4">
        <div className="flex items-center gap-6">
          <div className="text-lg font-extrabold tracking-tight">caawi.</div>
          <Link
            href="mailto:hello@caawi.org"
            className={`text-sm font-normal transition-opacity hover:opacity-100 ${muted}`}
          >
            hello@caawi.org
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <span className={`text-sm font-normal ${muted}`}>&copy; {new Date().getFullYear()} Somalis in Tech</span>
          <Link
            href="/privacy-policy"
            className={`text-sm font-normal underline transition-opacity hover:opacity-100 ${muted}`}
          >
            Privacy
          </Link>
          <Link
            href="/terms-and-conditions"
            className={`text-sm font-normal underline transition-opacity hover:opacity-100 ${muted}`}
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
