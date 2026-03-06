import LayerCard from '@/components/layer-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function SessionsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-pretty text-4xl font-bold text-foreground leading-[44px]">Sessions</h1>
          <p className="mt-1.5 text-pretty text-[15px] leading-relaxed text-muted-foreground">
            Your mentorship calendar, all sessions at a glance.
          </p>
        </div>
        <Skeleton className="h-8 w-40 rounded-md" />
      </div>

      {/* Controls bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-16 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="ml-auto h-9 w-48 rounded-md" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      {/* Calendar + sidebar layout */}
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="space-y-1">
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-8 rounded-md" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-7 gap-1">
                {Array.from({ length: 7 }).map((_, j) => (
                  <Skeleton key={j} className="h-20 rounded-md" />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden w-72 shrink-0 space-y-4 lg:block">
          <LayerCard>
            <LayerCard.Secondary>Next up</LayerCard.Secondary>
            <LayerCard.Primary>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            </LayerCard.Primary>
          </LayerCard>
          <LayerCard>
            <LayerCard.Secondary>This month</LayerCard.Secondary>
            <LayerCard.Primary>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            </LayerCard.Primary>
          </LayerCard>
        </div>
      </div>
    </div>
  );
}
