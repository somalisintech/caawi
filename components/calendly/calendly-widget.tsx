'use client';

import { PopupButton } from 'react-calendly';
import { Button } from '@/components/ui/button';
import type { Profile, User } from '@/generated/prisma/browser';

type CalendlyWidgetProps = {
  scheduling_url: string | null;
  user: Partial<User> | null;
  profile?: Partial<Profile> | null;
};

export function CalendlyWidget({ scheduling_url, user, profile }: CalendlyWidgetProps) {
  if (!scheduling_url || !user) {
    return null;
  }

  const name = [user.firstName, user.lastName].join(' ');
  const email = user.email || '';
  const bio = profile?.bio || '';

  return (
    <Button asChild>
      <PopupButton
        url={scheduling_url}
        text="Book a meeting"
        rootElement={document.body}
        prefill={{
          name,
          email,
          customAnswers: {
            a1: `Bio: ${bio}`
          }
        }}
      />
    </Button>
  );
}
