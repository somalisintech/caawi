import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import AuthProvider from '@/app/context/AuthProvider';
import dynamic from 'next/dynamic';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@vercel/analytics/react';

const ThemeProvider = dynamic(() => import('@/components/ThemeProvider'), { ssr: false });
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Caawi 🤝',
  description: 'add a description'
};

interface Props {
  children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html className="h-full" lang="en">
      <body className={`h-full ${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
            <Analytics />
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
