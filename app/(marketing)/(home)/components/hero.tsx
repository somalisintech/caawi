import { MentorCard } from '@/components/mentors/mentor-card';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import prisma from '@/lib/db';

export async function Hero() {
  const mentors = await prisma.mentorProfile.findMany({ take: 10 });

  return (
    <div className="container">
      <div className="grid grid-cols-1 items-center lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <h1 className="text-5xl font-bold">
            Empowering the Somali Community through <span className="text-primary">Mentorship.</span>
          </h1>
          <p className="text-muted-foreground">
            Join Caawi, the innovative digital mentorship platform that connects mentors and mentees within the Somali
            tech community. Experience professional growth and personal development through meaningful connections.
          </p>
          <Input placeholder="Search" className="max-w-[420px]" />
        </div>

        <div className="relative h-[400px] w-full justify-self-end overflow-hidden lg:h-[600px] lg:w-[480px]">
          <div className="absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-white to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-white to-transparent"></div>

          <div className="flex animate-mentors-scroll flex-col">
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="mb-4">
                <MentorCard mentor={mentor} />
              </Card>
            ))}
          </div>
          <div className="flex animate-mentors-scroll flex-col">
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="mb-4">
                <MentorCard mentor={mentor} />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
