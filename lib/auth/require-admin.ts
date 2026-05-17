import prisma from '@/lib/db';
import { createClient } from '@/utils/supabase/server';

export type AdminAuthResult =
  | { authorized: true; userId: string }
  | { authorized: false; reason: 'unauthenticated' | 'forbidden' };

export async function requireAdmin(): Promise<AdminAuthResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return { authorized: false, reason: 'unauthenticated' };
  }

  const user = await prisma.user.findUnique({
    where: { id: data.user.id },
    select: { role: true, bannedAt: true }
  });

  if (user?.role !== 'ADMIN' || user.bannedAt !== null) {
    return { authorized: false, reason: 'forbidden' };
  }

  return { authorized: true, userId: data.user.id };
}
