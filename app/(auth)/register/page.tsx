'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { CaawiLogo } from '@/components/brand/caawi-logo';
import { SocialAuth } from '@/components/auth/social-auth';
import { Separator } from '@/components/ui/separator';
import { RegisterForm } from './components/forms';

export default function Register() {
  return (
    <div>
      <CaawiLogo />
      <h2 className="my-6 text-3xl font-bold tracking-tight">Register for an account</h2>
      <div className="space-y-6">
        <Suspense>
          <RegisterForm />
        </Suspense>
        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <p className="text-sm text-muted-foreground">Or continue with</p>
          <Separator className="flex-1" />
        </div>
        <SocialAuth />
        <p className="text-center text-sm leading-6 text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold underline hover:text-primary">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
