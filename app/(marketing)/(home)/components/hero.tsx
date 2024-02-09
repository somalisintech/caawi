import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Hero() {
  return (
    <div className="container flex justify-center">
      <div className="flex max-w-4xl flex-col items-center space-y-8 py-16">
        <h1 className="text-center text-5xl font-bold leading-tight">
          Empowering the Somali Tech Community through <span className="text-primary">Mentorship.</span>
        </h1>
        <p className="text-center text-muted-foreground">
          Join Caawi, the innovative digital mentorship platform that connects mentors and mentees within the Somali
          tech community. Experience professional growth and personal development through meaningful connections.
        </p>
        <div className="flex gap-3">
          <Button size="lg" asChild>
            <Link href="/dashboard">Join Caawi</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/">Learn more</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
