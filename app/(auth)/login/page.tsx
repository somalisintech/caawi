import Link from 'next/link';
import { Suspense } from 'react';
import { CaawiLogo } from '@/components/brand/caawi-logo';
import { SocialAuth } from '@/components/auth/social-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LoginForm } from './components/forms';

export default function Login() {
  return (
    <div className="flex flex-col">
      <CaawiLogo className="size-18 mb-14" width={74} height={74} />
      <Card className="mb-8">
        <CardContent className="p-8">
          <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight">Welcome back 👋🏾</h2>
          <div className="space-y-6">
            <Suspense>
              <LoginForm />
            </Suspense>
            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <p className="text-sm text-muted-foreground">Or continue with</p>
              <Separator className="flex-1" />
            </div>
            <SocialAuth />
          </div>
        </CardContent>
      </Card>
      <p className="text-center text-sm leading-6 text-muted-foreground">
        Not a member?{' '}
        <Link href="/register" className="font-semibold text-primary underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
