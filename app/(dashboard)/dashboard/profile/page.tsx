import prisma from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { authOptions } from '@/app/api/auth/authOptions';
import { Session, getServerSession } from 'next-auth';

import { ProfileForm } from './components/forms';
import { CalendlyConnectionButton } from '@/components/calendly/calendly-connection-button';

export default async function SettingsProfilePage() {
  const session = (await getServerSession(authOptions)) as Session;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: session.user.id
    },
    select: {
      name: true,
      firstName: true,
      lastName: true,
      email: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      profile: true
    }
  });

  return (
    <div className="space-y-6 lg:max-w-2xl">
      <div>
        <div className="flex">
          <div>
            <h3 className="text-lg font-medium">Profile</h3>
            <p className="text-sm text-muted-foreground">This is how others will see you on the site.</p>
          </div>
          <div className="ml-auto self-baseline">
            <Badge variant="outline">{user.profile.userType}</Badge>
          </div>
        </div>
      </div>
      <Separator />
      <ProfileForm user={user} />
      {user.profile.userType === 'MENTOR' && (
        <>
          <Separator />
          <CalendlyConnectionButton />
        </>
      )}
    </div>
  );
}
