'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CaawiLogo } from '@/components/brand/caawi-logo';

function AuthCodeErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = 'There was an error signing in. Please try again.';

  switch (error) {
    case 'no_code':
      errorMessage = 'No authentication code was provided. Please try signing in again.';
      break;
    case 'exchange_failed':
      errorMessage = 'Failed to complete the authentication process. Please try again.';
      break;
    case 'validation_failed':
      errorMessage = 'The authentication data could not be validated. Please try signing in again.';
      break;
    case 'no_session':
      errorMessage = 'Unable to create a session. Please try signing in again.';
      break;
    case 'unexpected':
      errorMessage = 'An unexpected error occurred. Please try again later.';
      break;
    default:
      errorMessage = 'An unexpected error occurred. Please try again.';
      break;
  }

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-8">
      <CaawiLogo className="size-18 mb-14" width={74} height={74} />
      <h1 className="text-4xl font-semibold">Error</h1>
      <p className="text-center text-lg text-muted-foreground">{errorMessage}</p>
    </div>
  );
}

export default function AuthCodeErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCodeErrorContent />
    </Suspense>
  );
}
