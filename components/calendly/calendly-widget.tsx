'use client';

import { Button } from '@/components/ui/button';
import { Profile, User } from '@prisma/client';
import { PopupButton } from 'react-calendly';

type CalendlyWidgetProps = {
  scheduling_url: string | null;
  user: Partial<User & { profile: Partial<Profile> }> | null;
};

export function CalendlyWidget({ scheduling_url, user }: CalendlyWidgetProps) {
  if (!scheduling_url || !user) {
    return null;
  }

  const name = [user.firstName, user.lastName].join(' ');
  const email = user.email || '';
  const bio = user?.profile?.bio || '';

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
            a1: bio
          }
        }}
      />
    </Button>
  );
}
