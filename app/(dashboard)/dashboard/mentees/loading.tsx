import { Inbox, Users } from 'lucide-react';
import LayerCard from '@/components/layer-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function MenteesLoading() {
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
          <div className="divide-y divide-border">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-4">
                <Skeleton className="size-10 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full max-w-xs" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20 rounded-md" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </LayerCard.Primary>
      </LayerCard>

      <LayerCard>
        <LayerCard.Secondary>
          <Users className="size-4" />
          <span>Your mentees</span>
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
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            ))}
          </div>
        </LayerCard.Primary>
      </LayerCard>
    </div>
  );
}
