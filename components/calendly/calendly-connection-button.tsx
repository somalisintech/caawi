import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import prisma from '@/lib/db';

export async function CalendlyConnectionButton() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return null;
  }

  const { profile } = await prisma.user.findUniqueOrThrow({
    where: {
      id: userData.user.id
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

  if (profile.userType !== 'MENTOR') {
    return null;
  }

  const scheduling_url = profile?.calendlyUser?.scheduling_url;

  if (scheduling_url) {
    return (
      <Button disabled={!scheduling_url} variant="destructive">
        <Link href={'/api/calendly/disconnect'}>Disconnect</Link>
      </Button>
    );
  }

  return (
    <Button disabled={!!scheduling_url} variant="secondary">
      <Link href={'/api/calendly/connect'}>Connect</Link>
    </Button>
  );
}
