import { MentorsSearch } from '@/components/mentors/mentors-search';
import { Card } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import type { MenteeWithDetails } from '@/lib/queries/mentees';
import { MenteeBrowseCard } from './mentee-browse-card';

type Props = {
  mentees: MenteeWithDetails[];
  countries: string[];
  nudgeMap: Record<string, Date | null>;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  buildHref: (page: number) => string;
};

export function MenteesBrowseList({
  mentees,
  countries,
  nudgeMap,
  totalCount,
  totalPages,
  currentPage,
  buildHref
}: Props) {
  const start = totalCount > 0 ? (currentPage - 1) * 12 + 1 : 0;
  const end = start + mentees.length - 1;

  return (
    <Card className="grid grid-cols-1 divide-y-2 gap-0">
      <div className="p-5">
        <div className="mb-2 h-fit">
          <h3 className="text-lg font-medium">
            {totalCount > 0 ? `Showing ${start}-${end} of ${totalCount} mentees` : `Search (0 mentees)`}
          </h3>
        </div>
        <MentorsSearch countries={countries} />
      </div>
      {mentees.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
          <p>No mentees found</p>
          <p className="text-sm">Try adjusting your search</p>
        </div>
      ) : (
        mentees.map((mentee) => (
          <MenteeBrowseCard key={mentee.id} mentee={mentee} lastNudgedAt={nudgeMap[mentee.id] ?? null} />
        ))
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} buildHref={buildHref} />
    </Card>
  );
}
