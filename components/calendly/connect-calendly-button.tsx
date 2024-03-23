import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import prisma from '@/lib/db';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export async function ConnectCalendlyButton() {
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
          calendlyUser: true
        }
      }
    }
  });

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
