'use client';

import { useState } from 'react';
import { Hero } from './hero';
import { HowItWorks } from './how-it-works';
import { LandingFooter } from './landing-footer';
import { LandingNav } from './landing-nav';

type UserData = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  image: string | null;
} | null;

export function LandingShell({ user }: { user: UserData }) {
  const [dark, setDark] = useState(true);

  return (
    <div
      className={`flex min-h-screen flex-col font-[family-name:var(--font-manrope)] transition-colors duration-300 ${
        dark ? 'bg-[#1a1a1a] text-white' : 'bg-[#f5f5f0] text-[#1a1a1a]'
      }`}
    >
      <LandingNav dark={dark} onToggleTheme={() => setDark(!dark)} user={user} />
      <Hero dark={dark} />
      <HowItWorks dark={dark} />
      <LandingFooter dark={dark} />
    </div>
  );
}
