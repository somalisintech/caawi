import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { AdminSubNav } from '@/components/admin/admin-sub-nav';
import { requireAdmin } from '@/lib/auth/require-admin';

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Caawi admin dashboard.'
};

export default async function AdminLayout({ children }: PropsWithChildren) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-balance text-3xl font-bold text-foreground md:text-4xl">Admin</h1>
        <p className="mt-2 max-w-[600px] text-pretty text-base text-muted-foreground">
          Manage users, review reports, and monitor platform activity.
        </p>
      </div>
      <AdminSubNav />
      {children}
    </div>
  );
}
