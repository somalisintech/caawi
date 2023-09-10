import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import AuthProvider from '@/app/context/AuthProvider';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';

const ThemeProvider = dynamic(() => import('@/components/theme-provider'), { ssr: false });
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
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
