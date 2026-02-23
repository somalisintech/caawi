import type { PropsWithChildren } from 'react';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

export default async function MarketingLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container">
        <Header />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
