import { redirect } from 'next/navigation';
import { MentorScrollCard } from '@/components/mentors/mentor-scroll-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import prisma from '@/lib/db';
import { createClient } from '@/utils/supabase/server';

export async function Hero() {
  const [mentors, supabase] = await Promise.all([prisma.mentorProfile.findMany({ take: 10 }), createClient()]);
  const { data } = await supabase.auth.getUser();
  const authenticated = !!data.user;

  async function searchMentor(formData: FormData) {
    'use server';
    const search = formData.get('search');
    redirect(`/mentors?search=${search}`);
  }

  return (
    <div className="container">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-6 py-8">
          <h1 className="text-5xl font-bold">
            Empowering the Somali Community through <span className="text-primary">Mentorship.</span>
          </h1>
          <p className="text-muted-foreground">
            Join Caawi, the innovative digital mentorship platform that connects mentors and mentees within the Somali
            community. Experience professional growth and personal development through meaningful connections.
          </p>
          <form action={searchMentor} className="flex w-full items-center gap-2 rounded-lg border-2 p-2 lg:w-fit">
            <input
              name="search"
              placeholder="Search by skill, company or role"
              className="w-full border-none bg-transparent placeholder:text-muted-foreground focus:ring-0 lg:w-[320px]"
            />
            <Button type="submit" size="lg" className="text-nowrap px-4">
              Find mentors
            </Button>
          </form>
        </div>

        <div className="relative h-[400px] w-full justify-self-end overflow-hidden lg:h-[600px] lg:w-[480px]">
          <div className="absolute inset-x-0 top-0 z-10 h-8 bg-linear-to-b from-background to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 z-10 h-8 bg-linear-to-t from-background to-transparent"></div>

          <div className="flex animate-mentors-scroll flex-col">
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="mb-4">
                <MentorScrollCard mentor={mentor} authenticated={authenticated} />
              </Card>
            ))}
          </div>
          <div className="flex animate-mentors-scroll flex-col">
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="mb-4">
                <MentorScrollCard mentor={mentor} authenticated={authenticated} />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
