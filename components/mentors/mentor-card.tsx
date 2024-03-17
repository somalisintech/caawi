import { MentorProfile } from '@prisma/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Props = {
  mentor: MentorProfile;
};

// TODO: Include mentor photo

export async function MentorCard({ mentor }: Props) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="space-y-4">
          <Avatar>
            <AvatarImage />
            <AvatarFallback>{mentor.firstName ? mentor.firstName[0] : '-'}</AvatarFallback>
          </Avatar>
          <div>
            {mentor.firstName} {mentor.lastName}
          </div>
        </CardTitle>
        <CardDescription>
          {mentor.role} @ {mentor.company}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="bg-muted-background">
          <p>{mentor.bio || '-'}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={`/dashboard/mentors/${mentor.id}`}>View profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
