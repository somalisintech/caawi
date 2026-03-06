import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileLoading() {
  return (
    <div className="space-y-4">
      {/* Account type */}
      <Card>
        <CardHeader className="border-b-DEFAULT">
          <CardTitle>Account type</CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          <div className="flex gap-4">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Switch between mentee and mentor. Mentor profiles are publicly listed.
          </p>
        </CardContent>
      </Card>

      {/* Basic profile */}
      <Card>
        <CardHeader className="border-b-DEFAULT">
          <CardTitle className="flex items-center justify-between">
            <div>Basic profile</div>
            <Skeleton className="size-10 rounded-full" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            {['First Name', 'Last Name', 'Gender'].map((label) => (
              <div key={label} className="space-y-2">
                <p className="text-sm font-medium">{label}</p>
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Email</p>
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Bio</p>
            <Skeleton className="h-24 w-full rounded-md" />
          </div>
          {['Years of Experience', 'LinkedIn', 'GitHub'].map((label) => (
            <div key={label} className="space-y-2">
              <p className="text-sm font-medium">{label}</p>
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Occupation */}
      <Card>
        <CardHeader className="border-b-DEFAULT">
          <CardTitle>Occupation</CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {['Role', 'Company'].map((label) => (
              <div key={label} className="space-y-2">
                <p className="text-sm font-medium">{label}</p>
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader className="border-b-DEFAULT">
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {['Country', 'City'].map((label) => (
              <div key={label} className="space-y-2">
                <p className="text-sm font-medium">{label}</p>
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader className="border-b-DEFAULT">
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          <Skeleton className="h-10 w-full rounded-md" />
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-between">
        <Skeleton className="h-10 w-32 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </div>
  );
}
