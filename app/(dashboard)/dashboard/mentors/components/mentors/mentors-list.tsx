import { MentorProfile } from '@prisma/client';
import { MentorCard } from './mentor-card';

type Props = {
  mentors: MentorProfile[];
};

export function MentorsList({ mentors }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {mentors.map((mentor) => (
        <MentorCard key={mentor.id} mentor={mentor} />
      ))}
    </div>
  );
}
