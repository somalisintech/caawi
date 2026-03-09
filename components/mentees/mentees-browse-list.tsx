import { MentorsSearch } from '@/components/mentors/mentors-search';
import { Pagination } from '@/components/ui/pagination';
import { PAGE_SIZE } from '@/lib/constants/data';
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
  const start = totalCount > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const end = start + mentees.length - 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-balance text-3xl font-bold text-foreground md:text-4xl">Find Mentees</h1>
        <p className="mt-2 text-base text-muted-foreground">
          {totalCount > 0
            ? `Showing ${start}\u2013${end} of ${totalCount} mentees`
            : 'No mentees found \u2014 try adjusting your search'}
        </p>
      </div>

      <MentorsSearch countries={countries} />

      {mentees.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Try a different search or remove some filters
        </div>
      ) : (
        <div className="space-y-3">
          {mentees.map((mentee) => (
            <MenteeBrowseCard key={mentee.id} mentee={mentee} lastNudgedAt={nudgeMap[mentee.id] ?? null} />
          ))}
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}
