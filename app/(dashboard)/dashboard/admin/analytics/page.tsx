import { Suspense } from 'react';
import { AdminAnalyticsSkeleton } from '@/components/admin/admin-analytics-skeleton';
import { AdminAnalyticsView } from '@/components/admin/admin-analytics-view';
import { getAdminAnalytics } from '@/lib/queries/admin-analytics';

export default function AdminAnalyticsPage() {
  return (
    <Suspense fallback={<AdminAnalyticsSkeleton />}>
      <AdminAnalyticsContent />
    </Suspense>
  );
}

async function AdminAnalyticsContent() {
  const analytics = await getAdminAnalytics();
  return <AdminAnalyticsView analytics={analytics} />;
}
