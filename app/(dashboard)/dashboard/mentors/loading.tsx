import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function MentorsLoading() {
  return (
    <Card className="grid grid-cols-1 divide-y-2 gap-0">
      {/* Header — we know the structure, count is dynamic */}
      <div className="p-5">
        <div className="mb-2 h-fit">
          <h3 className="text-lg font-medium">
            Showing <Skeleton className="inline-block h-5 w-32 align-middle" />
          </h3>
        </div>
        {/* Search bar placeholder — keeps layout stable */}
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Mentor cards */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-4 p-5">
          <Skeleton className="size-12 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-4 w-full max-w-md" />
            <div className="flex gap-1.5 pt-1">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-9 w-16 shrink-0 self-center rounded-md" />
        </div>
      ))}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 p-4">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    </Card>
  );
}
