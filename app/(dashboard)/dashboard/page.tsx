import { redirect } from 'next/navigation';
import { MenteeHome } from '@/components/dashboard/mentee-home';
import { MentorHome } from '@/components/dashboard/mentor-home';
import prisma from '@/lib/db';
import { createClient } from '@/utils/supabase/server';

export default async function DashboardHomePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect('/auth');
  }

  const user = await prisma.user.findUnique({
    where: { email: data.user.email },
    select: { firstName: true, profile: { select: { userType: true, calendlyUser: { select: { uri: true } } } } }
  });

  if (user?.profile?.userType === 'MENTOR') {
    return <MentorHome firstName={user.firstName} hasCalendly={!!user.profile.calendlyUser} />;
  }

  const mentorCount = await prisma.mentorProfile.count();

  return <MenteeHome firstName={user?.firstName} mentorCount={mentorCount} />;
}
