import prisma from '@/lib/db';

export async function isBlocked(userAId: string, userBId: string): Promise<boolean> {
  const block = await prisma.block.findFirst({
    where: {
      OR: [
        { blockerId: userAId, blockedId: userBId },
        { blockerId: userBId, blockedId: userAId }
      ]
    }
  });
  return !!block;
}
