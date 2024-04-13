import prisma from '@/lib/db';
import { CalendlyConnectionButton } from '@/components/calendly/calendly-connection-button';
import { createClient } from '@/utils/supabase/server';
import { ProfileForm } from './components/forms';

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

  return <ProfileForm user={user} calendlyConnectionButton={<CalendlyConnectionButton />} />;
}
