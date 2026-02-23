'use client';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type Props = {
  userId: string;
};

export function ShareProfileButton({ userId }: Props) {
  const handleShare = () => {
    try {
      const origin = window.location.origin;
      const url = `${origin}/dashboard/mentors/${userId}`;
      navigator.clipboard.writeText(url);

      toast.success('Copied to clipboard');
    } catch (_err) {
      toast.error('Failed to copy url');
    }
  };

  return (
    <Button variant="secondary" onClick={handleShare}>
      Share profile
    </Button>
  );
}
