import prisma from '@/lib/db';

const PAGE_SIZE = 12;
const MAX_PAGE = 1000;

function parsePage(raw?: string): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 1) return 1;
  return Math.min(n, MAX_PAGE);
}

export async function getMenteesWithCountries(params?: { search?: string; country?: string; page?: string }) {
  const where: Record<string, unknown>[] = [{ userType: 'MENTEE' }, { onboardingCompleted: true }];

  if (params?.search) {
    const formattedSearch = params.search.trim().split(/\s+/).join(' | ');
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

  const [totalCount, allMentees] = await Promise.all([
    prisma.profile.count({ where: { AND: where } }),
    prisma.profile.findMany({
      where: { userType: 'MENTEE', onboardingCompleted: true, locationId: { not: null } },
      select: { location: { select: { country: true } } },
      distinct: ['locationId']
    })
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const page = totalPages > 0 ? Math.min(requestedPage, totalPages) : 1;
  const skip = (page - 1) * PAGE_SIZE;

  const mentees = await prisma.profile.findMany({
    where: { AND: where },
    include: {
      user: { select: { firstName: true, lastName: true, image: true } },
      location: true,
      occupation: true,
      skills: true
    },
    orderBy: [{ user: { firstName: 'asc' } }, { id: 'asc' }],
    skip,
    take: PAGE_SIZE
  });

  const countries = allMentees.map((m) => m.location?.country).filter(Boolean) as string[];
  countries.sort();

  return { mentees, countries, totalCount, totalPages, currentPage: page };
}

export type MenteeWithDetails = Awaited<ReturnType<typeof getMenteesWithCountries>>['mentees'][number];
