'use client';

import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { PopupButton } from 'react-calendly';

type CalendlyWidgetProps = {
  scheduling_url: string | null;
};

export function CalendlyWidget({ scheduling_url }: CalendlyWidgetProps) {
  const { data: session } = useSession();

  if (!session || !scheduling_url) {
    return null;
  }

  return (
    <Button asChild>
      <PopupButton
        url={scheduling_url}
        text="Book a meeting"
        rootElement={document.body}
        prefill={{
          name: session.user.name!,
          email: session.user.email!
        }}
      />
    </Button>
  );
}
