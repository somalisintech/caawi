'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

type Props = {
  userId: string;
};

export function ShareProfileButton({ userId }: Props) {
  const handleShare = () => {
    try {
      const origin = window.location.origin;
      const url = `${origin}/dashboard/mentors/${userId}`;
      navigator.clipboard.writeText(url);

      toast({
        title: 'Copied to clipboard'
      });
    } catch (_err) {
      toast({
        title: 'Failed to copy url'
      });
    }
  };

  return (
    <Button variant="secondary" onClick={handleShare}>
      Share profile
    </Button>
  );
}
