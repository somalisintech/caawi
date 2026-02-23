'use client';

import { AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface Props {
  error: Error & { digest?: string };
  reset: CallableFunction;
}

export default function Error({ error, reset }: Props) {
  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertCircleIcon className="size-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
      <Button variant="outline" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
