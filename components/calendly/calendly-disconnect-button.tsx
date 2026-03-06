'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function CalendlyDisconnectButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleDisconnect() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/calendly/disconnect', { method: 'POST' });
      if (!response.ok) {
        toast.error('Failed to disconnect Calendly');
        return;
      }
      if (response.redirected) {
        router.push(new URL(response.url).pathname);
      } else {
        router.refresh();
      }
    } catch {
      toast.error('Failed to disconnect Calendly');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button variant="outline" type="button" onClick={handleDisconnect} disabled={isLoading}>
      {isLoading ? 'Disconnecting...' : 'Disconnect'}
    </Button>
  );
}
