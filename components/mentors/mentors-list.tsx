import { Pagination } from '@/components/ui/pagination';
import type { MentorProfile } from '@/generated/prisma/client';
import { PAGE_SIZE } from '@/lib/constants/data';
import { MentorCard } from './mentor-card';
import { MentorsSearch } from './mentors-search';

type Props = {
  mentors: MentorProfile[];
  authenticated: boolean;
  countries?: string[];
  allSkills?: Record<string, string[]>;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  buildHref: (page: number) => string;
};

export function MentorsList({
  mentors,
  authenticated,
  countries,
  allSkills,
  totalCount,
  totalPages,
  currentPage,
  buildHref
}: Props) {
  const start = totalCount > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const end = start + mentors.length - 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-balance text-3xl font-bold text-foreground md:text-4xl">Mentors</h1>
        <p className="mt-2 text-base text-muted-foreground">
          {totalCount > 0
            ? `Showing ${start}\u2013${end} of ${totalCount} mentors`
            : 'No mentors found \u2014 try adjusting your search'}
        </p>
      </div>

      <MentorsSearch countries={countries} allSkills={allSkills} />

      {mentors.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Try a different search or remove some filters
        </div>
      ) : (
        <div className="space-y-3">
          {mentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} authenticated={authenticated} />
          ))}
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}
