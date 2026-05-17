import { PAGE_SIZE } from '@/lib/constants/data';
import prisma from '@/lib/db';
import { parsePage } from '@/lib/utils';

export type AdminReportRow = {
  id: string;
  reason: 'HARASSMENT' | 'SPAM' | 'INAPPROPRIATE_CONTENT' | 'IMPERSONATION' | 'OTHER';
  description: string | null;
  status: 'PENDING' | 'REVIEWED' | 'DISMISSED' | 'ACTION_TAKEN';
  reviewedAt: Date | null;
  reviewedBy: string | null;
  createdAt: Date;
  reporter: { id: string; firstName: string | null; lastName: string | null; email: string | null };
  reported: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    bannedAt: Date | null;
  };
};

const VALID_STATUSES = ['PENDING', 'REVIEWED', 'DISMISSED', 'ACTION_TAKEN'] as const;
type ReportStatus = (typeof VALID_STATUSES)[number];

export async function getAdminReports(params?: { status?: string; page?: string }) {
  const requested = (params?.status ?? 'PENDING').toUpperCase() as ReportStatus;
  const status: ReportStatus = (VALID_STATUSES as readonly string[]).includes(requested) ? requested : 'PENDING';

  const requestedPage = parsePage(params?.page);
  const skip = (requestedPage - 1) * PAGE_SIZE;

  const [totalCount, reports] = await Promise.all([
    prisma.report.count({ where: { status } }),
    prisma.report.findMany({
      where: { status },
      include: {
        reporter: { select: { id: true, firstName: true, lastName: true, email: true } },
        reported: { select: { id: true, firstName: true, lastName: true, email: true, bannedAt: true } }
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      skip,
      take: PAGE_SIZE
    })
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const page = totalPages > 0 ? Math.min(requestedPage, totalPages) : 1;

  const rows =
    page === requestedPage
      ? reports
      : await prisma.report.findMany({
          where: { status },
          include: {
            reporter: { select: { id: true, firstName: true, lastName: true, email: true } },
            reported: { select: { id: true, firstName: true, lastName: true, email: true, bannedAt: true } }
          },
          orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
          skip: (page - 1) * PAGE_SIZE,
          take: PAGE_SIZE
        });

  return { reports: rows as AdminReportRow[], status, totalCount, totalPages, currentPage: page };
}
