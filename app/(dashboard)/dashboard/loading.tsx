import LayerCard from '@/components/layer-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Greeting — name is dynamic but structure is known */}
      <div>
        <h1 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
          Welcome back
          <Skeleton className="ml-1 inline-block h-8 w-32 align-middle" />
        </h1>
        <Skeleton className="mt-2 h-5 w-80" />
      </div>

      {/* Stats grid — labels are known, values are dynamic */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {['Upcoming sessions', 'Unique mentees', 'Completed sessions', 'Pending requests', 'Next session'].map(
          (label) => (
            <LayerCard key={label}>
              <LayerCard.Secondary>
                <span>{label}</span>
              </LayerCard.Secondary>
              <LayerCard.Primary>
                <Skeleton className="h-8 w-12" />
              </LayerCard.Primary>
            </LayerCard>
          )
        )}
      </div>

      {/* Content cards — headings are known */}
      <LayerCard>
        <LayerCard.Secondary>Upcoming sessions</LayerCard.Secondary>
        <LayerCard.Primary className="p-0">
          <div className="divide-y divide-border">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="size-8 shrink-0 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </LayerCard.Primary>
      </LayerCard>

      <LayerCard>
        <LayerCard.Secondary>Recent sessions</LayerCard.Secondary>
        <LayerCard.Primary className="p-0">
          <div className="divide-y divide-border">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="size-8 shrink-0 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </LayerCard.Primary>
      </LayerCard>
    </div>
  );
}
