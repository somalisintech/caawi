import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { PropsWithChildren } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@vercel/analytics/react';
import { AxiomWebVitals } from 'next-axiom';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider, CSPostHogProvider } from '@/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Caawi 🤝',
  description: 'add a description'
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html className="h-full" lang="en" suppressHydrationWarning>
      <body className={`h-full ${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <CSPostHogProvider>{children}</CSPostHogProvider>
          <Analytics />
          <SpeedInsights />
          <AxiomWebVitals />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
