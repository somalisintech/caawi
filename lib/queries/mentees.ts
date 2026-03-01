import prisma from '@/lib/db';

export async function getMenteesWithCountries(params?: { search?: string; country?: string }) {
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

  const [mentees, allMentees] = await Promise.all([
    prisma.profile.findMany({
      where: { AND: where },
      include: {
        user: { select: { firstName: true, lastName: true, image: true } },
        location: true,
        occupation: true,
        skills: true
      }
    }),
    prisma.profile.findMany({
      where: { userType: 'MENTEE', onboardingCompleted: true, locationId: { not: null } },
      select: { location: { select: { country: true } } },
      distinct: ['locationId']
    })
  ]);

  const countries = allMentees.map((m) => m.location?.country).filter(Boolean) as string[];
  countries.sort();

  return { mentees, countries };
}

export type MenteeWithDetails = Awaited<ReturnType<typeof getMenteesWithCountries>>['mentees'][number];
