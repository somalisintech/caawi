import { ShieldAlert } from 'lucide-react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import LayerCard from '@/components/layer-card';
import { Footer } from '@/components/layout/footer';
import { Nav } from '@/components/layout/nav';
import prisma from '@/lib/db';
import { createClient } from '@/utils/supabase/server';
import { SignOutTrigger } from './sign-out-trigger';

export const metadata: Metadata = {
  title: 'Account suspended',
  description: 'This account has been suspended.'
};

export default async function BannedPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect('/');
  }

  const user = await prisma.user.findUnique({
    where: { id: data.user.id },
    select: { bannedAt: true }
  });

  if (!user?.bannedAt) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col font-[family-name:var(--font-manrope)]">
      <Nav user={null} className="px-[60px] max-lg:px-10 max-sm:px-6" />
      <main className="mx-auto flex w-full max-w-[560px] flex-1 items-center px-5 py-16 md:px-8">
        <LayerCard className="w-full">
          <LayerCard.Secondary>
            <ShieldAlert className="size-4 text-muted-foreground" />
            <span>Account suspended</span>
          </LayerCard.Secondary>
          <LayerCard.Primary className="gap-4 p-6 md:p-8">
            <h1 className="text-2xl font-semibold text-foreground">Your account is suspended</h1>
            <p className="text-sm text-muted-foreground">
              This account has been restricted from accessing Caawi. If you believe this is a mistake, reply to your
              original signup email and a moderator will review.
            </p>
            <SignOutTrigger />
          </LayerCard.Primary>
        </LayerCard>
      </main>
      <Footer className="px-[60px] max-lg:px-10 max-sm:px-6" />
    </div>
  );
}
