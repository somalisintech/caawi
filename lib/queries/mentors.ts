import { PAGE_SIZE } from '@/lib/constants/data';
import prisma from '@/lib/db';
import { parsePage } from '@/lib/utils';

export async function getMentorsWithCountries(params?: {
  search?: string;
  country?: string;
  skills?: string | string[];
  page?: string;
}) {
  const where: Record<string, unknown>[] = [];

  if (params?.search) {
    const words = params.search.trim().split(/\s+/);
    for (const word of words) {
      where.push({
        OR: [
          { firstName: { contains: word, mode: 'insensitive' } },
          { lastName: { contains: word, mode: 'insensitive' } },
          { role: { contains: word, mode: 'insensitive' } },
          { company: { contains: word, mode: 'insensitive' } },
          { country: { contains: word, mode: 'insensitive' } }
        ]
      });
    }
  }

  if (params?.country) {
    where.push({ country: { equals: params.country, mode: 'insensitive' } });
  }

  if (params?.skills) {
    const skillList = Array.isArray(params.skills) ? params.skills : [params.skills];
    if (skillList.length > 0) {
      where.push({ skills: { hasSome: skillList } });
    }
  }

  const requestedPage = parsePage(params?.page);
  const skip = (requestedPage - 1) * PAGE_SIZE;
  const whereClause = where.length > 0 ? { where: { AND: where } } : undefined;

  const [totalCount, allMentors, speculativeMentors] = await Promise.all([
    prisma.mentorProfile.count(whereClause),
    prisma.mentorProfile.findMany({ select: { country: true }, distinct: ['country'] }),
    prisma.mentorProfile.findMany({
      ...whereClause,
      orderBy: [{ firstName: 'asc' }, { id: 'asc' }],
      skip,
      take: PAGE_SIZE
    })
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const page = totalPages > 0 ? Math.min(requestedPage, totalPages) : 1;

  // Re-fetch only if requested page was beyond the last page
  const mentors =
    page === requestedPage
      ? speculativeMentors
      : await prisma.mentorProfile.findMany({
          ...whereClause,
          orderBy: [{ firstName: 'asc' }, { id: 'asc' }],
          skip: (page - 1) * PAGE_SIZE,
          take: PAGE_SIZE
        });

  const countries = allMentors.map((m) => m.country).filter(Boolean) as string[];
  countries.sort();

  return { mentors, countries, totalCount, totalPages, currentPage: page };
}
