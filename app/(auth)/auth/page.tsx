import { Suspense } from 'react';
import { CaawiLogo } from '@/components/brand/caawi-logo';
import { SocialAuth } from '@/components/auth/social-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AuthForm } from './components/forms';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Auth() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col">
      <CaawiLogo className="size-18 mb-14" width={74} height={74} />
      <Card className="mb-8">
        <CardContent className="p-8">
          <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight">Continue to Caawi</h2>
          <div className="space-y-6">
            <Suspense>
              <AuthForm />
            </Suspense>
            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <p className="text-sm text-muted-foreground">Or continue with</p>
              <Separator className="flex-1" />
            </div>
            <Suspense>
              <SocialAuth />
            </Suspense>
          </div>
        </CardContent>
      </Card>
      <p className="mx-auto max-w-[240px] text-center text-xs text-muted-foreground">
        By continuing to Caawi, you agree to our{' '}
        <a className="underline" href="/terms-and-conditions" target="_blank">
          Terms and Conditions
        </a>{' '}
        and{' '}
        <a className="underline" href="/privacy-policy" target="_blank">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}
