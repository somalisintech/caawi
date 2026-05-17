import LayerCard from '@/components/layer-card';
import type { AdminAnalytics } from '@/lib/queries/admin-analytics';
import { SignupSparkline } from './signup-sparkline';

type Props = {
  analytics: AdminAnalytics;
};

const REPORT_STATUS_LABEL: Record<AdminAnalytics['reportsByStatus'][number]['status'], string> = {
  PENDING: 'Pending',
  REVIEWED: 'Reviewed',
  DISMISSED: 'Dismissed',
  ACTION_TAKEN: 'Actioned'
};

export function AdminAnalyticsView({ analytics }: Props) {
  const peakSignup = Math.max(0, ...analytics.signupSeries.map((d) => d.count));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Platform overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">Snapshot across users, sessions, and trust &amp; safety.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <LayerCard>
          <LayerCard.Secondary>
            <span>Total users</span>
          </LayerCard.Secondary>
          <LayerCard.Primary>
            <p className="text-2xl tabular-nums text-foreground">{analytics.totalUsers}</p>
            <p className="text-xs text-muted-foreground">+{analytics.newUsers30d} in last 30 days</p>
          </LayerCard.Primary>
        </LayerCard>
        <LayerCard>
          <LayerCard.Secondary>
            <span>Mentors</span>
          </LayerCard.Secondary>
          <LayerCard.Primary>
            <p className="text-2xl tabular-nums text-foreground">{analytics.totalMentors}</p>
            <p className="text-xs text-muted-foreground">Onboarded mentors</p>
          </LayerCard.Primary>
        </LayerCard>
        <LayerCard>
          <LayerCard.Secondary>
            <span>Mentees</span>
          </LayerCard.Secondary>
          <LayerCard.Primary>
            <p className="text-2xl tabular-nums text-foreground">{analytics.totalMentees}</p>
            <p className="text-xs text-muted-foreground">Onboarded mentees</p>
          </LayerCard.Primary>
        </LayerCard>
        <LayerCard>
          <LayerCard.Secondary>
            <span>Banned users</span>
          </LayerCard.Secondary>
          <LayerCard.Primary>
            <p className="text-2xl tabular-nums text-foreground">{analytics.bannedUsers}</p>
            <p className="text-xs text-muted-foreground">Currently restricted</p>
          </LayerCard.Primary>
        </LayerCard>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <LayerCard>
          <LayerCard.Secondary>
            <span>Active sessions</span>
          </LayerCard.Secondary>
          <LayerCard.Primary>
            <p className="text-2xl tabular-nums text-foreground">{analytics.activeSessions}</p>
            <p className="text-xs text-muted-foreground">Booked or completed</p>
          </LayerCard.Primary>
        </LayerCard>
        <LayerCard>
          <LayerCard.Secondary>
            <span>Canceled sessions</span>
          </LayerCard.Secondary>
          <LayerCard.Primary>
            <p className="text-2xl tabular-nums text-foreground">{analytics.canceledSessions}</p>
            <p className="text-xs text-muted-foreground">All time</p>
          </LayerCard.Primary>
        </LayerCard>
        <LayerCard>
          <LayerCard.Secondary>
            <span>Sessions (30d)</span>
          </LayerCard.Secondary>
          <LayerCard.Primary>
            <p className="text-2xl tabular-nums text-foreground">{analytics.sessions30d}</p>
            <p className="text-xs text-muted-foreground">Created in last 30 days</p>
          </LayerCard.Primary>
        </LayerCard>
      </div>

      <LayerCard>
        <LayerCard.Secondary>
          <span>Signups · last 30 days</span>
          <span className="ml-auto text-xs text-muted-foreground tabular-nums">peak {peakSignup}/day</span>
        </LayerCard.Secondary>
        <LayerCard.Primary>
          <SignupSparkline data={analytics.signupSeries} />
        </LayerCard.Primary>
      </LayerCard>

      <LayerCard>
        <LayerCard.Secondary>
          <span>Reports by status</span>
        </LayerCard.Secondary>
        <LayerCard.Primary className="p-0">
          <ul className="divide-y divide-border">
            {analytics.reportsByStatus.map((row) => (
              <li key={row.status} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-foreground">{REPORT_STATUS_LABEL[row.status]}</span>
                <span className="text-sm tabular-nums text-muted-foreground">{row.count}</span>
              </li>
            ))}
          </ul>
        </LayerCard.Primary>
      </LayerCard>
    </div>
  );
}
