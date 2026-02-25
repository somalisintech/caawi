import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { PropsWithChildren } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { PostHogProvider, ThemeProvider } from '@/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Caawi 🤝',
  description: 'Empowering the Somali Community through Mentorship.'
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html className="h-full" lang="en" suppressHydrationWarning>
      <body className={`h-full ${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <PostHogProvider>{children}</PostHogProvider>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
