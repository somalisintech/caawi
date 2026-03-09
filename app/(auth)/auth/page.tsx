import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { SocialAuth } from '@/components/auth/social-auth';
import { LayerCard } from '@/components/layer-card';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/utils/supabase/server';
import { validateRedirectPath } from '@/utils/url';
import { AuthForm } from './components/forms';

export default async function Auth({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const { next } = await searchParams;

  if (data.user) {
    redirect(next ? validateRedirectPath(next) : '/dashboard');
  }

  return (
    <div className="flex flex-col items-center">
      <Link href="/" className="mb-10 text-2xl font-extrabold tracking-tight">
        caawi.
      </Link>

      <LayerCard className="w-full">
        <LayerCard.Secondary className="justify-center py-3">
          <h2 className="text-sm font-semibold tracking-tight">Continue to caawi</h2>
        </LayerCard.Secondary>

        <LayerCard.Primary className="gap-6 p-8">
          <Suspense>
            <AuthForm next={next} />
          </Suspense>

          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <p className="text-xs text-muted-foreground">or</p>
            <Separator className="flex-1" />
          </div>

          <Suspense>
            <SocialAuth next={next} />
          </Suspense>
        </LayerCard.Primary>

        <LayerCard.Secondary className="justify-center px-5 py-3">
          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our{' '}
            <Link className="underline" href="/terms-and-conditions" target="_blank" rel="noopener">
              Terms
            </Link>{' '}
            and{' '}
            <Link className="underline" href="/privacy-policy" target="_blank" rel="noopener">
              Privacy Policy
            </Link>
          </p>
        </LayerCard.Secondary>
      </LayerCard>
    </div>
  );
}
