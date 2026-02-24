'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function CalendlyDisconnectButton() {
  const router = useRouter();

  async function handleDisconnect() {
    const response = await fetch('/api/calendly/disconnect', { method: 'POST' });
    if (response.redirected) {
      router.push(new URL(response.url).pathname);
    } else {
      router.refresh();
    }
  }

  return (
    <Button variant="outline" type="button" onClick={handleDisconnect}>
      Disconnect
    </Button>
  );
}
