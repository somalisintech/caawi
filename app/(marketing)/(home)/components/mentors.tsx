import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const mentors = [1, 2, 3, 4, 5, 6, 7, 8];

export function Mentors() {
  return (
    <div className="relative pb-2 pt-16">
      <div className="container">
        <h2 className="mb-8 text-center text-3xl font-semibold">Meet some of our mentors</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {mentors.map((_, idx) => (
            <Card key={idx}>
              <CardHeader className="flex flex-row gap-2">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <CardTitle>James Smith</CardTitle>
                  <CardDescription>Backend Engineer</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam eaque veritatis est excepturi nemo a,
                  nostrum.
                </p>
              </CardContent>
              <CardFooter>
                <div className="relative h-4 w-12">
                  <Image src="https://cdn.worldvectorlogo.com/logos/netflix-3.svg" fill alt="" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[600px] bg-gradient-to-t from-white to-white/0" />
    </div>
  );
}
