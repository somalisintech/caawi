import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function MentorDetailLoading() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between">
          <div className="space-y-4">
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
        <Skeleton className="h-4 w-36" />
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        <Separator />
        <div className="space-y-1">
          <div className="text-sm uppercase text-muted-foreground">Bio</div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="space-y-2">
          <div className="text-sm uppercase text-muted-foreground">Skills</div>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-full" />
            ))}
          </div>
        </div>

        <Separator />
        <Separator />
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {['Country', 'City', 'Years of experience', 'Gender'].map((label) => (
            <div key={label} className="space-y-1">
              <div className="text-sm uppercase text-muted-foreground">{label}</div>
              <Skeleton className="h-5 w-24" />
            </div>
          ))}
        </div>

        <Separator />
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
