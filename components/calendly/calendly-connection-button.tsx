import { CalendlyDisconnectButton } from '@/components/calendly/calendly-disconnect-button';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';
import { createClient } from '@/utils/supabase/server';

export async function CalendlyConnectionButton() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!data.user || error) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: data.user.email
    },
    select: {
      profile: {
        select: {
          userType: true,
          calendlyUser: true
        }
      }
    }
  });

  if (!user) {
    logger.warn('User not found', {
      user: data.user
    });
    return null;
  }

  const { profile } = user;

  if (profile?.userType !== 'MENTOR') {
    return null;
  }

  const scheduling_url = profile?.calendlyUser?.scheduling_url;

  if (scheduling_url) {
    return <CalendlyDisconnectButton />;
  }

  return (
    <Button asChild variant="secondary">
      <a href="/api/calendly/connect">Connect</a>
    </Button>
  );
}
