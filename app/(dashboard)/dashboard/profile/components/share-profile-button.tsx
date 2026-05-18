'use client';

import { Share2 } from 'lucide-react';
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
    <Button variant="secondary" size="icon" onClick={handleShare} aria-label="Share profile">
      <Share2 className="size-4" />
    </Button>
  );
}
