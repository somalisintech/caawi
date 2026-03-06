'use client';

import * as Sentry from '@sentry/nextjs';
import { AlertCircleIcon } from 'lucide-react';
import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export function DashboardError({ error, reset }: Props) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertCircleIcon className="size-4" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>
          An unexpected error occurred. Please try again or contact support if the problem persists.
          {error.digest && <span className="mt-1 block text-xs text-muted-foreground">Reference: {error.digest}</span>}
        </AlertDescription>
      </Alert>
      <Button variant="outline" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
