import { Suspense } from 'react';
import { AdminReportsList } from '@/components/admin/admin-reports-list';
import { AdminReportsListSkeleton } from '@/components/admin/admin-reports-list-skeleton';
import { getAdminReports } from '@/lib/queries/admin-reports';

type SearchParams = Promise<{ status?: string; page?: string }>;

export default function AdminReportsPage(props: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<AdminReportsListSkeleton />}>
      <AdminReportsContent searchParams={props.searchParams} />
    </Suspense>
  );
}

async function AdminReportsContent({ searchParams: searchParamsPromise }: { searchParams: SearchParams }) {
  const searchParams = await searchParamsPromise;
  const { reports, status, totalCount, totalPages, currentPage } = await getAdminReports(searchParams);

  function buildHref(page: number) {
    const params = new URLSearchParams();
    if (status && status !== 'PENDING') params.set('status', status);
    if (page > 1) params.set('page', String(page));
    return params.toString() ? `?${params}` : '?';
  }

  return (
    <AdminReportsList
      reports={reports}
      status={status}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={currentPage}
      buildHref={buildHref}
    />
  );
}
