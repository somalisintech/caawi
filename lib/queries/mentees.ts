import { PAGE_SIZE } from '@/lib/constants/data';
import prisma from '@/lib/db';
import { parsePage } from '@/lib/utils';

export async function getMenteesWithCountries(params?: { search?: string; country?: string; page?: string }) {
  const where: Record<string, unknown>[] = [{ userType: 'MENTEE' }, { onboardingCompleted: true }];

  if (params?.search) {
    const words = params.search
      .trim()
      .replace(/[&|!():*<>'\\]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
    if (words.length === 0) return getMenteesWithCountries({ ...params, search: undefined });
    const formattedSearch = words.map((w) => `${w}:*`).join(' | ');
    where.push({
      OR: [
        { user: { firstName: { search: formattedSearch } } },
        { user: { lastName: { search: formattedSearch } } },
        { occupation: { role: { search: formattedSearch } } },
        { occupation: { company: { search: formattedSearch } } },
        { location: { country: { search: formattedSearch } } },
        { location: { city: { search: formattedSearch } } }
      ]
    });
  }

  if (params?.country) {
    where.push({ location: { country: { equals: params.country, mode: 'insensitive' } } });
  }

  const requestedPage = parsePage(params?.page);
  const skip = (requestedPage - 1) * PAGE_SIZE;

  const findManyArgs = {
    where: { AND: where },
    include: {
      user: { select: { firstName: true, lastName: true, image: true } },
      location: true,
      occupation: true,
      skills: true
    },
    orderBy: [{ user: { firstName: 'asc' as const } }, { id: 'asc' as const }]
  };

  const [totalCount, allMentees, speculativeMentees] = await Promise.all([
    prisma.profile.count({ where: { AND: where } }),
    prisma.profile.findMany({
      where: { userType: 'MENTEE', onboardingCompleted: true, locationId: { not: null } },
      select: { location: { select: { country: true } } },
      distinct: ['locationId']
    }),
    prisma.profile.findMany({ ...findManyArgs, skip, take: PAGE_SIZE })
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const page = totalPages > 0 ? Math.min(requestedPage, totalPages) : 1;

  // Re-fetch only if requested page was beyond the last page
  const mentees =
    page === requestedPage
      ? speculativeMentees
      : await prisma.profile.findMany({ ...findManyArgs, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE });

  const countries = allMentees.map((m) => m.location?.country).filter(Boolean) as string[];
  countries.sort();

  return { mentees, countries, totalCount, totalPages, currentPage: page };
}

export type MenteeWithDetails = Awaited<ReturnType<typeof getMenteesWithCountries>>['mentees'][number];
