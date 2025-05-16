import { MentorProfile } from '@prisma/client';

// Make sure MentorProfile has userId field, TS type for clarity
type MentorProfileWithUserId = MentorProfile & { userId: string };
import { MentorsSearch } from './mentors-search';
import { MentorCard } from './mentor-card';
import { Card } from '@/components/ui/card';

type Props = {
  mentors: MentorProfile[];
};

export function MentorsList({ mentors }: Props) {
  return (
    <Card className="grid grid-cols-1 divide-y-2">
      <div className="p-5">
        <div className="mb-2 h-fit">
          <h3 className="text-lg font-medium">Search</h3>
        </div>
        <MentorsSearch />
      </div>
      {mentors.map((mentor) => (
        <MentorCard key={mentor.id} mentor={mentor} />
      ))}
    </Card>
  );
}
