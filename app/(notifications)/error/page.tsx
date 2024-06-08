import { CaawiLogo } from '@/components/brand/caawi-logo';

export default function ErrorPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-8">
      <CaawiLogo className="size-18 mb-14" width={74} height={74} />
      <h1 className="text-4xl font-semibold">Error</h1>
      <p className="text-center text-lg text-muted-foreground">Oops! Looks like something went wrong.</p>
    </div>
  );
}
