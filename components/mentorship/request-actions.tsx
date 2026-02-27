'use client';

import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type Props = {
  requestId: string;
};

export function RequestActions({ requestId }: Props) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleAction(status: 'ACCEPTED' | 'DECLINED') {
    setIsPending(true);
    try {
      const res = await fetch(`/api/mentorship-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message ?? 'Something went wrong');
        return;
      }

      toast.success(status === 'ACCEPTED' ? 'Request accepted' : 'Request declined');
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" disabled={isPending} onClick={() => handleAction('ACCEPTED')} className="gap-1">
        <Check className="size-3.5" />
        Accept
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={() => handleAction('DECLINED')}
        className="gap-1"
      >
        <X className="size-3.5" />
        Decline
      </Button>
    </div>
  );
}
