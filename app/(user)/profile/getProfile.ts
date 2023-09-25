import prisma from '@/lib/db';
import { Session } from 'next-auth';

export async function getProfile(session: Session) {
  return prisma.user.findUnique({
    where: {
      id: session?.user.id
    },
    select: {
      name: true,
      firstName: true,
      lastName: true,
      email: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      profile: true
    }
  });
}
