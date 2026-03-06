import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { type LoggerRequest, withLogger } from '@/lib/with-logger';

const statusFilterSchema = z.enum(['PENDING', 'REVIEWED', 'DISMISSED', 'ACTION_TAKEN']);

async function requireAdmin(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });
  return user?.role === 'ADMIN';
}

export const GET = withLogger(async (req: LoggerRequest) => {
  if (!req.user) {
    return NextResponse.json({ message: 'Unauthorised' }, { status: 401 });
  }

  if (!(await requireAdmin(req.user.id))) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const rawStatus = searchParams.get('status') || 'PENDING';
  const parsed = statusFilterSchema.safeParse(rawStatus);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid status parameter' }, { status: 400 });
  }

  const status = parsed.data;

  const reports = await prisma.report.findMany({
    where: { status },
    include: {
      reporter: { select: { id: true, firstName: true, lastName: true, email: true } },
      reported: { select: { id: true, firstName: true, lastName: true, email: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  req.log.debug('Reports fetched', { count: reports.length, status });
  return NextResponse.json(reports);
});

const reviewSchema = z.object({
  reportId: z.string().uuid(),
  status: z.enum(['REVIEWED', 'DISMISSED', 'ACTION_TAKEN'])
});

export const PATCH = withLogger(async (req: LoggerRequest) => {
  if (!req.user) {
    return NextResponse.json({ message: 'Unauthorised' }, { status: 401 });
  }

  if (!(await requireAdmin(req.user.id))) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const parsed = reviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const { reportId, status } = parsed.data;

  const report = await prisma.report.update({
    where: { id: reportId },
    data: {
      status,
      reviewedAt: new Date(),
      reviewedBy: req.user.id
    }
  });

  req.log.info('Report reviewed', { reportId, status, reviewedBy: req.user.id });

  return NextResponse.json(report);
});
