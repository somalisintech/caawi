import { Suspense } from 'react';
import { AdminUsersList } from '@/components/admin/admin-users-list';
import { AdminUsersListSkeleton } from '@/components/admin/admin-users-list-skeleton';
import { getAdminUsers } from '@/lib/queries/admin';

type SearchParams = Promise<{ search?: string; status?: string; page?: string }>;

export default function AdminUsersPage(props: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<AdminUsersListSkeleton />}>
      <AdminUsersContent searchParams={props.searchParams} />
    </Suspense>
  );
}

async function AdminUsersContent({ searchParams: searchParamsPromise }: { searchParams: SearchParams }) {
  const searchParams = await searchParamsPromise;
  const { users, totalCount, totalPages, currentPage } = await getAdminUsers(searchParams);

  function buildHref(page: number) {
    const params = new URLSearchParams();
    if (searchParams.search) params.set('search', searchParams.search);
    if (searchParams.status) params.set('status', searchParams.status);
    if (page > 1) params.set('page', String(page));
    return params.toString() ? `?${params}` : '?';
  }

  return (
    <AdminUsersList
      users={users}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={currentPage}
      buildHref={buildHref}
    />
  );
}
