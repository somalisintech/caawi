import { Building, MapPin, PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { SiBuymeacoffee } from 'react-icons/si';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { UserWithProfile } from '@/types/user';

type Props = {
  user: UserWithProfile;
};

export function ProfileSummary({ user }: Props) {
  const avatarImage = user.image ?? '';
  const avatarFallback = user.firstName?.[0] ?? '-';
  const name = [user.firstName, user.lastName].join(' ');

  const role = [user.profile?.occupation?.role, user.profile?.occupation?.company].filter((r) => !!r).join(' @ ');
  const location = [user.profile?.location?.country, user.profile?.location?.city].filter((l) => !!l).join(', ');
  const socials = [user.profile?.linkedInUrl, user.profile?.githubUrl, user.profile?.buyMeCoffeeUrl].filter((s) => !!s);

  return (
    <div className="sticky top-8 flex h-fit flex-col gap-4">
      <Card className="sticky top-8 w-[368px]">
        <CardHeader className="flex flex-row items-center gap-3">
          <Avatar>
            <AvatarImage src={avatarImage} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <CardTitle>{name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
          <div className="flex flex-1 justify-end">
            <Button size="icon" variant="secondary" className="rounded-full" asChild>
              <Link href="/dashboard/profile">
                <PencilIcon size={16} />
              </Link>
            </Button>
          </div>
        </CardHeader>
        {user.profile?.bio && (
          <CardContent>
            <p className="text-sm">{user.profile?.bio}</p>
          </CardContent>
        )}
        <Separator />
        <CardFooter className="pt-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin size={16} />
              <p>{location || 'Earth'}</p>
            </div>
            {!!role.length && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Building size={16} />
                <p>{role}</p>
              </div>
            )}
            {!!socials.length && (
              <div className="mt-4 flex gap-2">
                {user.profile?.linkedInUrl && (
                  <Link className="text-sm underline" href={user.profile?.linkedInUrl} target="_blank">
                    <Button size="sm" variant="outline" className="gap-1 rounded-full">
                      <FaLinkedin />
                      LinkedIn
                    </Button>
                  </Link>
                )}
                {user.profile?.githubUrl && (
                  <Link className="text-sm underline" href={user.profile?.githubUrl} target="_blank">
                    <Button size="sm" variant="outline" className="gap-1 rounded-full">
                      <FaGithub />
                      GitHub
                    </Button>
                  </Link>
                )}
                {user.profile?.buyMeCoffeeUrl && (
                  <Link className="text-sm underline" href={user.profile?.buyMeCoffeeUrl} target="_blank">
                    <Button size="sm" variant="outline" className="gap-1 rounded-full">
                      <SiBuymeacoffee />
                      Buy Me Coffee
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
