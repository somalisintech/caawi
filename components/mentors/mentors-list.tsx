import { Card } from '@/components/ui/card';
import type { MentorProfile } from '@/generated/prisma/client';
import { MentorCard } from './mentor-card';
import { MentorsSearch } from './mentors-search';

type Props = {
  mentors: MentorProfile[];
  authenticated: boolean;
};

export function MentorsList({ mentors, authenticated }: Props) {
  return (
    <Card className="grid grid-cols-1 divide-y-2">
      <div className="p-5">
        <div className="mb-2 h-fit">
          <h3 className="text-lg font-medium">Search</h3>
        </div>
        <MentorsSearch />
      </div>
      {mentors.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
          <p>No mentors found</p>
          <p className="text-sm">Try adjusting your search</p>
        </div>
      ) : (
        <>
          <p className="px-6 py-2 text-sm text-muted-foreground">{mentors.length} mentors</p>
          {mentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} authenticated={authenticated} />
          ))}
        </>
      )}
    </Card>
  );
}
