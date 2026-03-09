import { ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import LayerCard from '@/components/layer-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const filters = ['All', 'Upcoming', 'Past', 'Canceled'];
const views = ['Week', 'Month'];

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
        <div className="flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/40 px-3 py-1.5 text-[13px] text-muted-foreground">
          <Globe className="size-3.5" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>

      {/* Controls bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="size-8" disabled>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-3 text-[13px] font-medium" disabled>
              Today
            </Button>
            <Button variant="outline" size="icon" className="size-8" disabled>
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <Skeleton className="ml-1 h-5 w-36" />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-lg border border-border/60 bg-muted/30 p-0.5">
            {filters.map((f, i) => (
              <span
                key={f}
                className={cn(
                  'rounded-md px-2.5 py-1 text-[13px] font-medium',
                  i === 0 ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                )}
              >
                {f}
              </span>
            ))}
          </div>
          <div className="flex gap-0.5 rounded-lg border border-border/60 bg-muted/30 p-0.5">
            {views.map((v, i) => (
              <span
                key={v}
                className={cn(
                  'rounded-md px-2.5 py-1 text-[13px] font-medium',
                  i === 0 ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                )}
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main content: 70/30 split */}
      <div className="flex flex-col gap-6 xl:flex-row">
        {/* Calendar */}
        <div className="min-w-0 xl:flex-[7]">
          <LayerCard>
            <LayerCard.Primary className="p-4">
              <Skeleton className="h-[500px] w-full rounded-md" />
            </LayerCard.Primary>
          </LayerCard>
        </div>

        {/* Sidebar */}
        <div className="xl:flex-[3]">
          <div className="sticky top-8 space-y-4">
            <LayerCard>
              <LayerCard.Secondary>Next up</LayerCard.Secondary>
              <LayerCard.Primary className="pt-2">
                <div className="space-y-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5">
                      <Skeleton className="size-9 shrink-0 rounded-full" />
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <Skeleton className="h-3.5 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <div className="space-y-1.5 text-right">
                        <Skeleton className="ml-auto h-5 w-16 rounded-full" />
                        <Skeleton className="ml-auto h-3 w-10" />
                      </div>
                    </div>
                  ))}
                </div>
              </LayerCard.Primary>
            </LayerCard>

            <LayerCard>
              <LayerCard.Secondary className="border-b border-border">
                This month
                <Skeleton className="ml-1.5 h-3.5 w-16" />
              </LayerCard.Secondary>
              <LayerCard.Primary className="p-0">
                <div className="divide-y divide-border/40">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                      <Skeleton className="h-8 w-1 shrink-0 rounded-full" />
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <Skeleton className="h-3.5 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </LayerCard.Primary>
            </LayerCard>
          </div>
        </div>
      </div>
    </div>
  );
}
