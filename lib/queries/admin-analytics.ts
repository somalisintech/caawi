import prisma from '@/lib/db';

const ROLLING_DAYS = 30;

export type DailyCount = { date: string; count: number };

export type AdminAnalytics = {
  totalUsers: number;
  newUsers30d: number;
  totalMentors: number;
  totalMentees: number;
  bannedUsers: number;
  activeSessions: number;
  canceledSessions: number;
  sessions30d: number;
  pendingReports: number;
  reportsByStatus: { status: 'PENDING' | 'REVIEWED' | 'DISMISSED' | 'ACTION_TAKEN'; count: number }[];
  signupSeries: DailyCount[];
};

function startOfDayUTC(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  const now = new Date();
  const since = startOfDayUTC(new Date(now.getTime() - (ROLLING_DAYS - 1) * 24 * 60 * 60 * 1000));

  const [
    totalUsers,
    newUsers30d,
    bannedUsers,
    totalMentors,
    totalMentees,
    activeSessions,
    canceledSessions,
    sessions30d,
    reportsByStatusRaw,
    recentSignups
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: since } } }),
    prisma.user.count({ where: { NOT: { bannedAt: null } } }),
    prisma.profile.count({ where: { userType: 'MENTOR', onboardingCompleted: true } }),
    prisma.profile.count({ where: { userType: 'MENTEE', onboardingCompleted: true } }),
    prisma.session.count({ where: { status: 'ACTIVE' } }),
    prisma.session.count({ where: { status: 'CANCELED' } }),
    prisma.session.count({ where: { createdAt: { gte: since } } }),
    prisma.report.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.user.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true }
    })
  ]);

  const buckets = new Map<string, number>();
  for (let i = 0; i < ROLLING_DAYS; i++) {
    const day = new Date(since.getTime() + i * 24 * 60 * 60 * 1000);
    buckets.set(day.toISOString().slice(0, 10), 0);
  }
  for (const u of recentSignups) {
    const key = u.createdAt.toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  const signupSeries: DailyCount[] = [...buckets.entries()].map(([date, count]) => ({ date, count }));

  const allStatuses: AdminAnalytics['reportsByStatus'][number]['status'][] = [
    'PENDING',
    'REVIEWED',
    'DISMISSED',
    'ACTION_TAKEN'
  ];
  const reportsByStatus = allStatuses.map((status) => ({
    status,
    count: reportsByStatusRaw.find((r) => r.status === status)?._count._all ?? 0
  }));

  const pendingReports = reportsByStatus.find((r) => r.status === 'PENDING')?.count ?? 0;

  return {
    totalUsers,
    newUsers30d,
    totalMentors,
    totalMentees,
    bannedUsers,
    activeSessions,
    canceledSessions,
    sessions30d,
    pendingReports,
    reportsByStatus,
    signupSeries
  };
}
