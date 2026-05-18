import { Hourglass, Users } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import LayerCard from '@/components/layer-card';
import { ParticipantCard } from '@/components/mentorship/participant-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import prisma from '@/lib/db';
import { getActiveMentors, getPendingMentorRequests } from '@/lib/queries/mentorship-requests';
import { createClient } from '@/utils/supabase/server';

export default function MentorsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-balance text-3xl font-bold text-foreground md:text-4xl">Mentors</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Requests you&apos;ve sent and the mentors you&apos;ve connected with.
        </p>
      </div>

      <Suspense fallback={<MentorsCardsSkeleton />}>
        <MentorsContent />
      </Suspense>
    </div>
  );
}

function MentorsCardsSkeleton() {
  return (
    <>
      <LayerCard>
        <LayerCard.Secondary>
          <Hourglass className="size-4" />
          <span>Awaiting response</span>
        </LayerCard.Secondary>
        <LayerCard.Primary className="p-0">
          <div className="divide-y divide-border">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-4">
                <Skeleton className="size-10 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full max-w-xs" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </LayerCard.Primary>
      </LayerCard>

      <LayerCard>
        <LayerCard.Secondary>
          <Users className="size-4" />
          <span>Your mentors</span>
        </LayerCard.Secondary>
        <LayerCard.Primary className="p-0">
          <div className="divide-y divide-border">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-4">
                <Skeleton className="size-10 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full max-w-xs" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </LayerCard.Primary>
      </LayerCard>
    </>
  );
}

async function MentorsContent() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect('/auth');
  }

  const user = await prisma.user.findUnique({
    where: { id: data.user.id },
    select: {
      profile: {
        select: { id: true, userType: true }
      }
    }
  });

  if (user?.profile?.userType !== 'MENTEE') {
    redirect('/dashboard');
  }

  const profileId = user.profile.id;
  const [pendingRequests, activeMentors] = await Promise.all([
    getPendingMentorRequests(profileId),
    getActiveMentors(profileId)
  ]);

  const noActivity = pendingRequests.length === 0 && activeMentors.length === 0;

  return (
    <>
      <LayerCard>
        <LayerCard.Secondary>
          <Hourglass className="size-4" />
          <span>Awaiting response</span>
        </LayerCard.Secondary>
        <LayerCard.Primary className="p-0">
          {pendingRequests.length > 0 ? (
            <div className="divide-y divide-border">
              {pendingRequests.map((request) => {
                const { user: mentorUser } = request.mentorProfile;
                return (
                  <ParticipantCard
                    key={request.id}
                    firstName={mentorUser.firstName}
                    lastName={mentorUser.lastName}
                    image={mentorUser.image}
                    message={request.message}
                    createdAt={request.createdAt}
                    actions={
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/dashboard/mentors/${request.mentorProfile.id}`}>View</Link>
                      </Button>
                    }
                  />
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No requests awaiting a response</p>
            </div>
          )}
        </LayerCard.Primary>
      </LayerCard>

      <LayerCard>
        <LayerCard.Secondary>
          <Users className="size-4" />
          <span>Your mentors</span>
        </LayerCard.Secondary>
        <LayerCard.Primary className="p-0">
          {activeMentors.length > 0 ? (
            <div className="divide-y divide-border">
              {activeMentors.map((request) => {
                const { user: mentorUser } = request.mentorProfile;
                return (
                  <ParticipantCard
                    key={request.id}
                    firstName={mentorUser.firstName}
                    lastName={mentorUser.lastName}
                    image={mentorUser.image}
                    createdAt={request.createdAt}
                    actions={
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/dashboard/mentors/${request.mentorProfile.id}`}>View</Link>
                      </Button>
                    }
                  />
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                {noActivity ? 'No mentors yet — find one to get started.' : 'No active mentors yet.'}
              </p>
            </div>
          )}
        </LayerCard.Primary>
      </LayerCard>

      {noActivity && (
        <div className="flex justify-center">
          <Button asChild>
            <Link href="/dashboard/browse-mentors">Find a mentor</Link>
          </Button>
        </div>
      )}
    </>
  );
}
