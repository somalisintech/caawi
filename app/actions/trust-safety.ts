'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';
import { createClient } from '@/utils/supabase/server';

const reportSchema = z.object({
  reportedId: z.string().uuid(),
  reason: z.enum(['HARASSMENT', 'SPAM', 'INAPPROPRIATE_CONTENT', 'IMPERSONATION', 'OTHER']),
  description: z.string().max(1000).optional()
});

const blockSchema = z.object({
  blockedId: z.string().uuid()
});

export async function reportUserAction(data: { reportedId: string; reason: string; description?: string }) {
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.getUser();

  if (!authData.user || error) {
    return { success: false, message: 'Unauthorised' };
  }

  const parsed = reportSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: 'Invalid data' };
  }

  const { reportedId, reason, description } = parsed.data;

  if (reportedId === authData.user.id) {
    return { success: false, message: 'You cannot report yourself' };
  }

  const reportedUser = await prisma.user.findUnique({ where: { id: reportedId } });
  if (!reportedUser) {
    return { success: false, message: 'User not found' };
  }

  await prisma.report.create({
    data: {
      reporterId: authData.user.id,
      reportedId,
      reason,
      description
    }
  });

  logger.info('User reported', { reporterId: authData.user.id, reportedId, reason });

  return { success: true, message: 'Report submitted' };
}

export async function blockUserAction(data: { blockedId: string }) {
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.getUser();

  if (!authData.user || error) {
    return { success: false, message: 'Unauthorised' };
  }

  const parsed = blockSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: 'Invalid data' };
  }

  const { blockedId } = parsed.data;

  if (blockedId === authData.user.id) {
    return { success: false, message: 'You cannot block yourself' };
  }

  const blockedUser = await prisma.user.findUnique({ where: { id: blockedId } });
  if (!blockedUser) {
    return { success: false, message: 'User not found' };
  }

  await prisma.block.upsert({
    where: {
      blockerId_blockedId: {
        blockerId: authData.user.id,
        blockedId
      }
    },
    create: {
      blockerId: authData.user.id,
      blockedId
    },
    update: {}
  });

  logger.info('User blocked', { blockerId: authData.user.id, blockedId });

  revalidatePath('/dashboard');
  return { success: true, message: 'User blocked' };
}

export async function unblockUserAction(data: { blockedId: string }) {
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.getUser();

  if (!authData.user || error) {
    return { success: false, message: 'Unauthorised' };
  }

  const parsed = blockSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: 'Invalid data' };
  }

  const { blockedId } = parsed.data;

  await prisma.block.deleteMany({
    where: {
      blockerId: authData.user.id,
      blockedId
    }
  });

  logger.info('User unblocked', { blockerId: authData.user.id, blockedId });

  revalidatePath('/dashboard');
  return { success: true, message: 'User unblocked' };
}
