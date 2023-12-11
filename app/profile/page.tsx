import { Separator } from '@/components/ui/separator';
import { ProfileForm } from './profile-form';
import { authOptions } from '@/app/api/auth/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import prisma from '@/lib/db';

export default async function SettingsProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect('/login');

  const user = await prisma.user.findUnique({
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

  if (!user) return redirect('/login');

  return (
    <div className="space-y-6">
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
      <ProfileForm {...user} />
    </div>
  );
}
