import { Card } from '@/components/ui/card';
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
    <Card className="grid grid-cols-1 divide-y-2 gap-0">
      <div className="p-5">
        <div className="mb-2 h-fit">
          <h3 className="text-lg font-medium">
            {totalCount > 0 ? `Showing ${start}-${end} of ${totalCount} mentors` : `Search (0 mentors)`}
          </h3>
        </div>
        <MentorsSearch countries={countries} allSkills={allSkills} />
      </div>
      {mentors.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
          <p>No mentors found</p>
          <p className="text-sm">Try adjusting your search</p>
        </div>
      ) : (
        mentors.map((mentor) => <MentorCard key={mentor.id} mentor={mentor} authenticated={authenticated} />)
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} buildHref={buildHref} />
    </Card>
  );
}
