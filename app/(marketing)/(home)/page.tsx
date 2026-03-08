import prisma from '@/lib/db';
import { createClient } from '@/utils/supabase/server';
import { LandingShell } from './components/landing-shell';

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  let user = null;
  if (data.user && !error && data.user.email) {
    user = await prisma.user.findUnique({
      where: { email: data.user.email },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        image: true
      }
    });
  }

  return <LandingShell user={user} />;
}
