'use client';

import { Button } from '@/components/ui/button';
import { PopupButton } from 'react-calendly';
import { type User } from '@supabase/supabase-js';

// TODO: We might need to pass profile here in order to access the users name

type CalendlyWidgetProps = {
  scheduling_url: string | null;
  user: User | null;
};

export function CalendlyWidget({ scheduling_url, user }: CalendlyWidgetProps) {
  if (!scheduling_url || !user) {
    return null;
  }

  return (
    <Button asChild>
      <PopupButton
        url={scheduling_url}
        text="Book a meeting"
        rootElement={document.body}
        prefill={{
          // name: user.name!,
          email: user.email!
        }}
      />
    </Button>
  );
}
