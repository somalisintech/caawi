'use client';

import { InlineWidget } from 'react-calendly';
import { useSession } from 'next-auth/react';

type CalendlyWidgetProps = {
  scheduling_url: string | null;
};
export function CalendlyWidget({ scheduling_url }: CalendlyWidgetProps) {
  const { data: session } = useSession();

  if (!session || !scheduling_url) {
    return null;
  }

  return (
    <div className="w-full">
      <InlineWidget
        url={scheduling_url}
        prefill={{
          name: session.user.name!,
          email: session.user.email!
        }}
      />
    </div>
  );
}
