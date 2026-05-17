import LayerCard from '@/components/layer-card';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminReportsListSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Reports</h2>
        <Skeleton className="mt-1 h-4 w-40" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {['Pending', 'Reviewed', 'Actioned', 'Dismissed'].map((label) => (
          <Skeleton key={label} className="h-7 w-20" />
        ))}
      </div>

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <LayerCard key={i}>
            <LayerCard.Secondary>
              <Skeleton className="h-4 w-24" />
            </LayerCard.Secondary>
            <LayerCard.Primary>
              <div className="space-y-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-32" />
              </div>
            </LayerCard.Primary>
          </LayerCard>
        ))}
      </div>
    </div>
  );
}
