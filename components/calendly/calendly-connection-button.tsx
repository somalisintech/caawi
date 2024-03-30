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
      <Button className="ml-auto flex" size="lg" disabled={!scheduling_url} variant="destructive">
        <Link href={'/api/calendly/disconnect'}>Disconnect Calendly</Link>
      </Button>
    );
  }

  return (
    <Button className="ml-auto flex" size="lg" disabled={!!scheduling_url}>
      <Link href={'/api/calendly/connect'}>Connect Calendly</Link>
    </Button>
  );
}
