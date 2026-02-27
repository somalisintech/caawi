import { Inbox, Users } from 'lucide-react';
import { redirect } from 'next/navigation';
import LayerCard from '@/components/layer-card';
import { MenteeCard } from '@/components/mentorship/mentee-card';
import { NudgeButton } from '@/components/mentorship/nudge-button';
import { RequestActions } from '@/components/mentorship/request-actions';
import prisma from '@/lib/db';
import { getActiveMentees, getPendingRequests } from '@/lib/queries/mentorship-requests';
import { createClient } from '@/utils/supabase/server';

export default async function MenteesPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect('/auth');
  }

  const user = await prisma.user.findUnique({
    where: { email: data.user.email },
    select: {
      profile: {
        select: { id: true, userType: true }
      }
    }
  });

  if (user?.profile?.userType !== 'MENTOR') {
    redirect('/dashboard');
  }

  const profileId = user.profile.id;
  const [pendingRequests, activeMentees] = await Promise.all([
    getPendingRequests(profileId),
    getActiveMentees(profileId)
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-balance text-3xl font-bold text-foreground md:text-4xl">Mentees</h1>
        <p className="mt-2 text-base text-muted-foreground">Review requests and manage your mentees.</p>
      </div>

      <LayerCard>
        <LayerCard.Secondary>
          <Inbox className="size-4" />
          <span>Pending requests</span>
        </LayerCard.Secondary>
        <LayerCard.Primary className="p-0">
          {pendingRequests.length > 0 ? (
            <div className="divide-y divide-border">
              {pendingRequests.map((request) => {
                const { user: menteeUser } = request.menteeProfile;
                return (
                  <MenteeCard
                    key={request.id}
                    firstName={menteeUser.firstName}
                    lastName={menteeUser.lastName}
                    image={menteeUser.image}
                    message={request.message}
                    createdAt={request.createdAt}
                    actions={<RequestActions requestId={request.id} />}
                  />
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No pending requests</p>
            </div>
          )}
        </LayerCard.Primary>
      </LayerCard>

      <LayerCard>
        <LayerCard.Secondary>
          <Users className="size-4" />
          <span>Your mentees</span>
        </LayerCard.Secondary>
        <LayerCard.Primary className="p-0">
          {activeMentees.length > 0 ? (
            <div className="divide-y divide-border">
              {activeMentees.map((request) => {
                const { user: menteeUser } = request.menteeProfile;
                return (
                  <MenteeCard
                    key={request.id}
                    firstName={menteeUser.firstName}
                    lastName={menteeUser.lastName}
                    image={menteeUser.image}
                    message={request.message}
                    createdAt={request.createdAt}
                    actions={<NudgeButton requestId={request.id} lastNudgedAt={request.lastNudgedAt} />}
                  />
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No mentees yet. Accept a request to get started.</p>
            </div>
          )}
        </LayerCard.Primary>
      </LayerCard>
    </div>
  );
}
