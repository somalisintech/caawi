import LayerCard from '@/components/layer-card';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminAnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Platform overview</h2>
        <Skeleton className="mt-1 h-4 w-56" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {['Total users', 'Mentors', 'Mentees', 'Banned users'].map((label) => (
          <LayerCard key={label}>
            <LayerCard.Secondary>
              <span>{label}</span>
            </LayerCard.Secondary>
            <LayerCard.Primary>
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-3 w-24" />
            </LayerCard.Primary>
          </LayerCard>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {['Active sessions', 'Canceled sessions', 'Sessions (30d)'].map((label) => (
          <LayerCard key={label}>
            <LayerCard.Secondary>
              <span>{label}</span>
            </LayerCard.Secondary>
            <LayerCard.Primary>
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-3 w-24" />
            </LayerCard.Primary>
          </LayerCard>
        ))}
      </div>

      <LayerCard>
        <LayerCard.Secondary>
          <span>Signups · last 30 days</span>
        </LayerCard.Secondary>
        <LayerCard.Primary>
          <Skeleton className="h-20 w-full" />
        </LayerCard.Primary>
      </LayerCard>
    </div>
  );
}
