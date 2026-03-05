import { MentorsSearch } from '@/components/mentors/mentors-search';
import { Card } from '@/components/ui/card';
import type { MenteeWithDetails } from '@/lib/queries/mentees';
import { MenteeBrowseCard } from './mentee-browse-card';

type Props = {
  mentees: MenteeWithDetails[];
  countries: string[];
  nudgeMap: Record<string, Date | null>;
};

export function MenteesBrowseList({ mentees, countries, nudgeMap }: Props) {
  return (
    <Card className="grid grid-cols-1 divide-y-2 gap-0">
      <div className="p-5">
        <div className="mb-2 h-fit">
          <h3 className="text-lg font-medium">Search ({mentees.length} mentees)</h3>
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
    </Card>
  );
}
