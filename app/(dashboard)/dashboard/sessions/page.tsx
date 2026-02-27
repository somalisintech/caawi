import { redirect } from 'next/navigation';
import { SessionsView } from '@/components/dashboard/sessions-view';
import prisma from '@/lib/db';
import { getSessionsForRange } from '@/lib/queries/sessions';
import { createClient } from '@/utils/supabase/server';

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

export default async function SessionsPage({
  searchParams
}: {
  searchParams: Promise<{ year?: string; month?: string; day?: string }>;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect('/auth');
  }

  const user = await prisma.user.findUnique({
    where: { email: data.user.email },
    select: {
      profile: {
        select: {
          id: true,
          userType: true,
          calendlyUser: { select: { uri: true } }
        }
      }
    }
  });

  const profileId = user?.profile?.id;
  const userType = user?.profile?.userType === 'MENTOR' ? 'MENTOR' : 'MENTEE';
  const hasCalendly = !!user?.profile?.calendlyUser;

  const params = await searchParams;
  const now = new Date();
  const year = clamp(params.year ? Number.parseInt(params.year, 10) : now.getFullYear(), 2020, 2099);
  const month = clamp(params.month ? Number.parseInt(params.month, 10) : now.getMonth(), 0, 11);
  const maxDay = new Date(year, month + 1, 0).getDate();
  const day = clamp(params.day ? Number.parseInt(params.day, 10) : now.getDate(), 1, maxDay);

  // Pad ±7 days around the month to cover week-view boundary overlap
  const rangeStart = new Date(Date.UTC(year, month, 1 - 7));
  const rangeEnd = new Date(Date.UTC(year, month + 1, 1 + 7));

  const rawSessions = profileId ? await getSessionsForRange(profileId, userType, rangeStart, rangeEnd) : [];

  const sessions = rawSessions.map((s) => {
    const counterpart = userType === 'MENTOR' ? s.menteeProfile.user : s.mentorProfile.user;
    return {
      id: s.id,
      eventName: s.eventName,
      startTime: s.startTime.toISOString(),
      endTime: s.endTime.toISOString(),
      status: s.status,
      canceledAt: s.canceledAt?.toISOString() ?? null,
      counterpart
    };
  });

  return (
    <SessionsView
      sessions={sessions}
      userType={userType}
      hasCalendly={hasCalendly}
      year={year}
      month={month}
      day={day}
    />
  );
}
