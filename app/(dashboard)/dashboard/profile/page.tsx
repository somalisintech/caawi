import prisma from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { ProfileForm } from './components/forms';
import { ShareProfileButton } from './components/share-profile-button';
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
        <div className="flex items-center justify-between">
          <div>
            <div className="flex gap-2">
              <h3 className="text-lg font-medium">
                <span>Profile</span>
              </h3>
              <Badge variant="outline">{user.profile?.userType}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">This is how others will see you on the site.</p>
          </div>
          <ShareProfileButton userId={user.id} />
        </div>
      </div>
      <ProfileForm user={user} calendlyConnectionButton={<CalendlyConnectionButton />} />
    </div>
  );
}
