import prisma from '@/lib/db';
import { CalendlyConnectionButton } from '@/components/calendly/calendly-connection-button';
import { createClient } from '@/utils/supabase/server';
import { ProfileForm } from './components/forms';
import { redirect } from 'next/navigation';

export default async function SettingsProfilePage() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  const user = await prisma.user.findUnique({
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

  if (!user) {
    redirect('/auth');
  }

  return <ProfileForm user={user} calendlyConnectionButton={<CalendlyConnectionButton />} />;
}
