import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import prisma from '@/lib/db';
import { log } from 'next-axiom';

export async function CalendlyConnectionButton() {
  const supabase = createClient();
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
    log.warn('User not found', {
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
    return (
      <Button disabled={!scheduling_url} variant="outline" type="button">
        <Link prefetch={false} href={'/api/calendly/disconnect'}>
          Disconnect
        </Link>
      </Button>
    );
  }

  return (
    <Button disabled={!!scheduling_url} variant="secondary" type="button">
      <Link href={'/api/calendly/connect'}>Connect</Link>
    </Button>
  );
}
