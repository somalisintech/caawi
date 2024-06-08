import { CaawiLogo } from '@/components/brand/caawi-logo';

export default function CheckEmailPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-8">
      <CaawiLogo className="size-18 mb-14" width={74} height={74} />
      <h1 className="text-4xl font-semibold">Check your email</h1>
      <p className="text-center text-lg text-muted-foreground">We&apos;ve sent you an email with a link to sign in.</p>
    </div>
  );
}
