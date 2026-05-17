import LayerCard from '@/components/layer-card';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminUsersListSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Users</h2>
        <Skeleton className="mt-1 h-4 w-48" />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 sm:w-44" />
      </div>

      <LayerCard>
        <LayerCard.Primary className="p-0">
          <ul className="divide-y divide-border">
            {Array.from({ length: 8 }).map((_, i) => (
              <li key={i} className="flex items-center gap-4 px-4 py-3">
                <Skeleton className="size-10 shrink-0 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-16 shrink-0" />
              </li>
            ))}
          </ul>
        </LayerCard.Primary>
      </LayerCard>
    </div>
  );
}
