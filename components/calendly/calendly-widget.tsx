'use client';

import { Button } from '@/components/ui/button';
import { User } from '@prisma/client';
import { PopupButton } from 'react-calendly';

type CalendlyWidgetProps = {
  scheduling_url: string | null;
  user: Partial<User> | null;
};

export function CalendlyWidget({ scheduling_url, user }: CalendlyWidgetProps) {
  if (!scheduling_url || !user) {
    return null;
  }

  const name = [user.firstName, user.lastName].join(' ');
  const email = user.email || '';

  return (
    <Button asChild>
      <PopupButton
        url={scheduling_url}
        text="Book a meeting"
        rootElement={document.body}
        prefill={{
          name,
          email
        }}
      />
    </Button>
  );
}
