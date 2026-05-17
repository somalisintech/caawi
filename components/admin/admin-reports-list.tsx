import LayerCard from '@/components/layer-card';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { PAGE_SIZE } from '@/lib/constants/data';
import type { AdminReportRow } from '@/lib/queries/admin-reports';
import { AdminReportActions } from './admin-report-actions';
import { AdminReportsStatusTabs } from './admin-reports-status-tabs';

type Props = {
  reports: AdminReportRow[];
  status: 'PENDING' | 'REVIEWED' | 'DISMISSED' | 'ACTION_TAKEN';
  totalCount: number;
  totalPages: number;
  currentPage: number;
  buildHref: (page: number) => string;
};

const REASON_LABEL: Record<AdminReportRow['reason'], string> = {
  HARASSMENT: 'Harassment',
  SPAM: 'Spam',
  INAPPROPRIATE_CONTENT: 'Inappropriate content',
  IMPERSONATION: 'Impersonation',
  OTHER: 'Other'
};

function userName(u: { firstName: string | null; lastName: string | null; email: string | null }) {
  const name = [u.firstName, u.lastName].filter(Boolean).join(' ');
  return name || u.email || 'Unknown user';
}

function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function AdminReportsList({ reports, status, totalCount, totalPages, currentPage, buildHref }: Props) {
  const start = totalCount > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const end = start + reports.length - 1;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Reports</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {totalCount > 0
            ? `Showing ${start}\u2013${end} of ${totalCount}`
            : status === 'PENDING'
              ? 'No pending reports — you\u2019re all caught up.'
              : 'Nothing here.'}
        </p>
      </div>

      <AdminReportsStatusTabs current={status} />

      {reports.length === 0 ? (
        <LayerCard>
          <LayerCard.Primary className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {status === 'PENDING' ? 'No pending reports to review.' : 'No reports in this state.'}
            </p>
          </LayerCard.Primary>
        </LayerCard>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => {
            const banned = !!report.reported.bannedAt;
            return (
              <LayerCard key={report.id}>
                <LayerCard.Secondary>
                  <span>{REASON_LABEL[report.reason]}</span>
                  <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                    {formatDate(report.createdAt)}
                  </span>
                </LayerCard.Secondary>
                <LayerCard.Primary className="gap-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Reported user</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{userName(report.reported)}</p>
                          {banned && <Badge variant="destructive">Banned</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{report.reported.email ?? 'No email'}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Reporter</p>
                        <p className="mt-1 text-sm text-foreground">{userName(report.reporter)}</p>
                        <p className="text-xs text-muted-foreground">{report.reporter.email ?? 'No email'}</p>
                      </div>
                    </div>
                    {status === 'PENDING' && (
                      <AdminReportActions
                        reportId={report.id}
                        reportedUserName={userName(report.reported)}
                        reportedUserIsBanned={banned}
                      />
                    )}
                  </div>
                  {report.description && (
                    <div className="rounded-md border border-border bg-background/40 p-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Description</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{report.description}</p>
                    </div>
                  )}
                </LayerCard.Primary>
              </LayerCard>
            );
          })}
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}
