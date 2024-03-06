import prisma from '@/lib/db';
import { MentorsList } from './components/mentors';

export default async function SettingsNotificationsPage() {
  const mentors = await prisma.mentorProfile.findMany();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Search</h3>
          <p className="text-sm text-muted-foreground">Search for mentors</p>
        </div>
        <MentorsList mentors={mentors} />
      </div>
    </div>
  );
}
