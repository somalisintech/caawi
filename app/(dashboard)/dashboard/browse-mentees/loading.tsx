import { MentorsSearch } from '@/components/mentors/mentors-search';
import { Skeleton } from '@/components/ui/skeleton';

export default function BrowseMenteesLoading() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-balance text-3xl font-bold text-foreground md:text-4xl">Find Mentees</h1>
        <Skeleton className="mt-2 h-5 w-64" />
      </div>

      <MentorsSearch />

      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3.5 w-48" />
                </div>
              </div>
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
            <Skeleton className="mt-3 h-4 w-full max-w-lg" />
            <div className="mt-3 flex gap-1.5">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
