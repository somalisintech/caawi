import { PAGE_SIZE } from '@/lib/constants/data';
import prisma from '@/lib/db';
import { parsePage } from '@/lib/utils';

export type AdminUserRow = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  image: string | null;
  role: 'USER' | 'ADMIN';
  bannedAt: Date | null;
  createdAt: Date;
  profile: { userType: 'MENTOR' | 'MENTEE' | null } | null;
};

export async function getAdminUsers(params?: { search?: string; status?: string; page?: string }) {
  const search = params?.search?.trim();
  const status = params?.status;

  const filters: Record<string, unknown>[] = [];

  if (search) {
    filters.push({
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    });
  }

  if (status === 'banned') {
    filters.push({ NOT: { bannedAt: null } });
  } else if (status === 'active') {
    filters.push({ bannedAt: null });
  } else if (status === 'admin') {
    filters.push({ role: 'ADMIN' });
  }

  const where = filters.length > 0 ? { AND: filters } : undefined;

  const requestedPage = parsePage(params?.page);
  const skip = (requestedPage - 1) * PAGE_SIZE;

  const [totalCount, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        role: true,
        bannedAt: true,
        createdAt: true,
        profile: { select: { userType: true } }
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
      ? users
      : await prisma.user.findMany({
          where,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            role: true,
            bannedAt: true,
            createdAt: true,
            profile: { select: { userType: true } }
          },
          orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
          skip: (page - 1) * PAGE_SIZE,
          take: PAGE_SIZE
        });

  return { users: rows as AdminUserRow[], totalCount, totalPages, currentPage: page };
}
