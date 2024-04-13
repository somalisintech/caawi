import { MentorProfile } from '@prisma/client';
import { MentorCard } from './mentor-card';
import { Card } from '@/components/ui/card';

type Props = {
  mentors: MentorProfile[];
};

export function MentorsList({ mentors }: Props) {
  return (
    <Card className="grid grid-cols-1 divide-y-2">
      {mentors.map((mentor) => (
        <MentorCard key={mentor.id} mentor={mentor} />
      ))}
    </Card>
  );
}
