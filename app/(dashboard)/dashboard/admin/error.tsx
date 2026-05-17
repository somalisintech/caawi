'use client';

import * as Sentry from '@sentry/nextjs';
import { AlertCircleIcon } from 'lucide-react';
import { useEffect } from 'react';
import LayerCard from '@/components/layer-card';
import { Button } from '@/components/ui/button';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: Props) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <LayerCard>
      <LayerCard.Secondary>
        <AlertCircleIcon className="size-4 text-destructive" />
        <span>Something went wrong</span>
      </LayerCard.Secondary>
      <LayerCard.Primary className="gap-3 p-6">
        <p className="text-sm text-foreground">
          We couldn&apos;t load this admin view. The error has been reported. Try again, and if it keeps happening, ping
          another admin.
        </p>
        {error.digest && <p className="text-xs tabular-nums text-muted-foreground">Reference: {error.digest}</p>}
        <Button variant="outline" onClick={reset} className="w-fit">
          Try again
        </Button>
      </LayerCard.Primary>
    </LayerCard>
  );
}
