import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Anton_SC, DM_Mono, Inter, Kulim_Park, Manrope, Playfair_Display, Roboto } from 'next/font/google';
import type { PropsWithChildren } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { PostHogProvider, ThemeProvider } from '@/providers';

const inter = Inter({ subsets: ['latin'] });

const antonSC = Anton_SC({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton-sc'
});

const dmMono = DM_Mono({
  weight: '500',
  subsets: ['latin'],
  variable: '--font-dm-mono'
});

const kulimPark = Kulim_Park({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-kulim-park'
});

const playfairDisplay = Playfair_Display({
  weight: '700',
  subsets: ['latin'],
  variable: '--font-playfair'
});

const roboto = Roboto({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-roboto'
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope'
});

export const metadata: Metadata = {
  title: 'Caawi 🤝',
  description: 'Empowering the Somali Community through Mentorship.'
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html className="h-full" lang="en" suppressHydrationWarning>
      <body
        className={`h-full ${inter.className} ${antonSC.variable} ${dmMono.variable} ${kulimPark.variable} ${playfairDisplay.variable} ${roboto.variable} ${manrope.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <PostHogProvider>{children}</PostHogProvider>
          <Analytics />
          <SpeedInsights />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
