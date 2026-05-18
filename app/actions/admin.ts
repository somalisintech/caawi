'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth/require-admin';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';

type ActionResult = { success: boolean; message: string; idempotent?: boolean };

const userIdSchema = z.object({ userId: z.string().uuid() });

const reportTransitionSchema = z.object({
  reportId: z.string().uuid(),
  status: z.enum(['REVIEWED', 'DISMISSED'])
});

const banAndCloseSchema = z.object({ reportId: z.string().uuid() });

export async function banUserAction(data: { userId: string }): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return { success: false, message: auth.reason === 'forbidden' ? 'Forbidden' : 'Unauthorised' };
  }

  const parsed = userIdSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: 'Invalid data' };
  }

  const { userId } = parsed.data;

  if (userId === auth.userId) {
    return { success: false, message: 'You cannot ban yourself' };
  }

  const target = await prisma.user.findUnique({ where: { id: userId }, select: { role: true, bannedAt: true } });
  if (!target) {
    return { success: false, message: 'User not found' };
  }
  if (target.role === 'ADMIN') {
    return { success: false, message: 'Admins cannot be banned' };
  }
  if (target.bannedAt) {
    return { success: true, message: 'User is already banned', idempotent: true };
  }

  try {
    const result = await prisma.user.updateMany({
      where: { id: userId, bannedAt: null, role: { not: 'ADMIN' } },
      data: { bannedAt: new Date() }
    });

    if (result.count === 0) {
      return { success: true, message: 'User is already banned', idempotent: true };
    }
  } catch (err) {
    logger.error('Failed to ban user', { adminId: auth.userId, userId, err });
    return { success: false, message: 'Could not ban user. Please try again.' };
  }

  logger.info('User banned', { adminId: auth.userId, userId });
  revalidatePath('/dashboard/admin', 'layout');
  return { success: true, message: 'User banned' };
}

export async function unbanUserAction(data: { userId: string }): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return { success: false, message: auth.reason === 'forbidden' ? 'Forbidden' : 'Unauthorised' };
  }

  const parsed = userIdSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: 'Invalid data' };
  }

  const { userId } = parsed.data;

  try {
    const result = await prisma.user.updateMany({
      where: { id: userId, NOT: { bannedAt: null } },
      data: { bannedAt: null }
    });

    if (result.count === 0) {
      const exists = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
      if (!exists) return { success: false, message: 'User not found' };
      return { success: true, message: 'User is not banned', idempotent: true };
    }
  } catch (err) {
    logger.error('Failed to unban user', { adminId: auth.userId, userId, err });
    return { success: false, message: 'Could not unban user. Please try again.' };
  }

  logger.info('User unbanned', { adminId: auth.userId, userId });
  revalidatePath('/dashboard/admin', 'layout');
  return { success: true, message: 'User unbanned' };
}

export async function updateReportStatusAction(data: {
  reportId: string;
  status: 'REVIEWED' | 'DISMISSED';
}): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return { success: false, message: auth.reason === 'forbidden' ? 'Forbidden' : 'Unauthorised' };
  }

  const parsed = reportTransitionSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: 'Invalid data' };
  }

  const { reportId, status } = parsed.data;

  try {
    const result = await prisma.report.updateMany({
      where: { id: reportId, status: 'PENDING' },
      data: { status, reviewedAt: new Date(), reviewedBy: auth.userId }
    });

    if (result.count === 0) {
      const exists = await prisma.report.findUnique({ where: { id: reportId }, select: { status: true } });
      if (!exists) return { success: false, message: 'Report not found' };
      return { success: false, message: 'Report has already been reviewed' };
    }
  } catch (err) {
    logger.error('Failed to update report status', { adminId: auth.userId, reportId, status, err });
    return { success: false, message: 'Could not update report. Please try again.' };
  }

  logger.info('Report status updated', { adminId: auth.userId, reportId, status });
  revalidatePath('/dashboard/admin/reports');
  return { success: true, message: 'Report updated' };
}

export async function banAndCloseReportAction(data: { reportId: string }): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return { success: false, message: auth.reason === 'forbidden' ? 'Forbidden' : 'Unauthorised' };
  }

  const parsed = banAndCloseSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: 'Invalid data' };
  }

  const { reportId } = parsed.data;

  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: { id: true, status: true, reportedId: true, reported: { select: { role: true } } }
  });

  if (!report) {
    return { success: false, message: 'Report not found' };
  }
  if (report.status !== 'PENDING') {
    return { success: false, message: 'Report has already been reviewed' };
  }
  if (report.reportedId === auth.userId) {
    return { success: false, message: 'You cannot ban yourself' };
  }
  if (report.reported.role === 'ADMIN') {
    return { success: false, message: 'Admins cannot be banned' };
  }

  const BAN_FAILED = Symbol('ban-failed');
  const REPORT_STALE = Symbol('report-stale');

  try {
    await prisma.$transaction(async (tx) => {
      const reportUpdate = await tx.report.updateMany({
        where: { id: reportId, status: 'PENDING' },
        data: { status: 'ACTION_TAKEN', reviewedAt: new Date(), reviewedBy: auth.userId }
      });

      if (reportUpdate.count === 0) {
        throw REPORT_STALE;
      }

      // Only ban if not already banned (preserves original bannedAt); skip admins.
      const userUpdate = await tx.user.updateMany({
        where: { id: report.reportedId, role: { not: 'ADMIN' }, bannedAt: null },
        data: { bannedAt: new Date() }
      });

      if (userUpdate.count === 0) {
        // Verify the row still exists and is not an admin; if so, user is already banned (idempotent).
        const target = await tx.user.findUnique({
          where: { id: report.reportedId },
          select: { role: true, bannedAt: true }
        });
        if (!target || target.role === 'ADMIN' || !target.bannedAt) {
          throw BAN_FAILED;
        }
      }
    });
  } catch (err) {
    if (err === REPORT_STALE) {
      return { success: false, message: 'Report has already been reviewed' };
    }
    if (err === BAN_FAILED) {
      return { success: false, message: 'User no longer exists or cannot be banned' };
    }
    logger.error('Failed to ban and close report', { adminId: auth.userId, reportId, err });
    return { success: false, message: 'Could not complete action. Please try again.' };
  }

  logger.info('Report actioned with ban', { adminId: auth.userId, reportId, userId: report.reportedId });
  revalidatePath('/dashboard/admin', 'layout');
  return { success: true, message: 'User banned and report closed' };
}
