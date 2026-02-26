import { Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Props = {
  firstName?: string | null;
  mentorCount: number;
};

export function MenteeHome({ firstName, mentorCount }: Props) {
  const greeting = firstName ? `Welcome back, ${firstName}` : 'Welcome back';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#111] md:text-4xl md:leading-[44px] dark:text-zinc-100">
          {greeting}
        </h1>
        <p className="mt-2 max-w-[600px] text-base text-[#666] dark:text-zinc-400">
          Find a mentor who can help you grow and book a session.
        </p>
      </div>

      <div className="rounded-xl border border-border p-6 md:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Search className="size-5 text-[#777] dark:text-zinc-500" />
            <div>
              <p className="font-semibold text-[#111] dark:text-zinc-100">{mentorCount} mentors available</p>
              <p className="mt-0.5 text-sm text-[#777] dark:text-zinc-400">Search by name, skill, or country.</p>
            </div>
          </div>
          <Button
            asChild
            className="h-11 shrink-0 rounded-lg bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/dashboard/mentors">Find a mentor</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
