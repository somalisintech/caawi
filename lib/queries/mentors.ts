import prisma from '@/lib/db';

export async function getMentorsWithCountries(params?: { search?: string; country?: string }) {
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

  const [mentors, allMentors] = await Promise.all([
    prisma.mentorProfile.findMany(where.length > 0 ? { where: { AND: where } } : undefined),
    prisma.mentorProfile.findMany({ select: { country: true }, distinct: ['country'] })
  ]);

  const countries = allMentors.map((m) => m.country).filter(Boolean) as string[];
  countries.sort();

  return { mentors, countries };
}
