import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/db';
import Link from 'next/link';

export async function CalendlyConnectionButton() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const { profile } = await prisma.user.findUniqueOrThrow({
    where: {
      id: session.user.id
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
