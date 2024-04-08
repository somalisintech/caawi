import prisma from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { ProfileForm } from './components/forms';
import { CalendlyConnectionButton } from '@/components/calendly/calendly-connection-button';
import { createClient } from '@/utils/supabase/server';

export default async function SettingsProfilePage() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: data.user?.id
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      profile: {
        include: {
          location: true,
          occupation: true,
          calendlyUser: true
        }
      }
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
            <Badge variant="outline">{user.profile?.userType}</Badge>
          </div>
        </div>
      </div>
      <ProfileForm user={user} calendlyConnectionButton={<CalendlyConnectionButton />} />
    </div>
  );
}
