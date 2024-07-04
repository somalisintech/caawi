import { Separator } from '@/components/ui/separator';
import { MentorProfile as MentorProfileType } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendlyWidget } from '@/components/calendly/calendly-widget';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/db';
import Link from 'next/link';
import { ShareProfileButton } from '@/app/(dashboard)/dashboard/profile/components/share-profile-button';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { SiBuymeacoffee } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';

type Props = {
  mentor: MentorProfileType;
};

export async function MentorProfile({ mentor }: Props) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!data.user || error) {
    redirect('/auth');
  }

  const user = await prisma.user.findUnique({
    where: {
      email: data.user.email
    },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      image: true,
      profile: {
        select: {
          gender: true
        }
      }
    }
  });

  const canBook = !mentor.sameGenderPref || mentor.gender === user?.profile?.gender;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div className="space-y-4">
            <Avatar>
              <AvatarImage src={mentor.image || ''} />
              <AvatarFallback>{mentor.firstName ? mentor.firstName[0] : '-'}</AvatarFallback>
            </Avatar>
            <div>
              {mentor.firstName} {mentor.lastName}
            </div>
          </div>
          <ShareProfileButton userId={mentor.id} />
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
        <Separator />
        <div className="flex flex-wrap gap-4">
          {mentor.linkedInUrl && (
            <Link className="text-sm underline" href={mentor.linkedInUrl} target="_blank">
              <Button size="sm" variant="outline" className="gap-1 rounded-full">
                <FaLinkedin />
                LinkedIn
              </Button>
            </Link>
          )}
          {mentor.githubUrl && (
            <Link className="text-sm underline" href={mentor.githubUrl} target="_blank">
              <Button size="sm" variant="outline" className="gap-1 rounded-full">
                <FaGithub />
                GitHub
              </Button>
            </Link>
          )}
          {mentor.buyMeCoffeeUrl && (
            <Link className="text-sm underline" href={mentor.buyMeCoffeeUrl} target="_blank">
              <Button size="sm" variant="outline" className="gap-1 rounded-full">
                <SiBuymeacoffee />
                Buy me a coffee
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {canBook && <CalendlyWidget scheduling_url={mentor.calendlySchedulingUrl} user={user} />}
        {!canBook && (
          <p className="text-sm text-muted-foreground">*This mentor only accepts bookings with the same gender</p>
        )}
      </CardFooter>
    </Card>
  );
}
