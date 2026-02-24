import { redirect } from 'next/navigation';
import { CalendlyConnectionButton } from '@/components/calendly/calendly-connection-button';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';
import { createClient } from '@/utils/supabase/server';
import { ProfileForm } from './components/forms';

export default async function SettingsProfilePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    logger.warn('Error fetching user', { error });
    redirect('/auth');
  }

  const user = await prisma.user.findUnique({
    where: {
      email: data.user.email
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
