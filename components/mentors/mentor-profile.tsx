import { Separator } from '@/components/ui/separator';
import { MentorProfile as MentorProfileType } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendlyWidget } from '@/components/calendly/calendly-widget';

type Props = {
  mentor: MentorProfileType;
};

export async function MentorProfile({ mentor }: Props) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="space-y-4">
          <Avatar>
            <AvatarImage src={mentor.image || ''} />
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
      <CardContent className="flex-1 space-y-6">
        <Separator />
        <div className="space-y-1">
          <div className="text-sm uppercase text-muted-foreground">Bio</div>
          <p>{mentor.bio || '-'}</p>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="space-y-1">
            <div className="text-sm uppercase text-muted-foreground">Country</div>
            <div className="text-sm">{mentor.country}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm uppercase text-muted-foreground">City</div>
            <div className="text-sm">{mentor.city}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm uppercase text-muted-foreground">Years of experience</div>
            <div className="text-sm">{mentor.yearsOfExperience}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm uppercase text-muted-foreground">Gender</div>
            <div className="text-sm">{mentor.gender}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <CalendlyWidget scheduling_url={mentor.calendlySchedulingUrl} />
      </CardFooter>
    </Card>
  );
}
