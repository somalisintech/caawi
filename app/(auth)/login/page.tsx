import Link from 'next/link';
import { CaawiLogo } from '@/components/brand/caawi-logo';
import { SocialAuth } from '@/components/auth/social-auth';
import { Separator } from '@/components/ui/separator';
import { LoginForm } from './components/forms';

export default function Login() {
  return (
    <div>
      <CaawiLogo />
      <h2 className="my-6 text-3xl font-bold tracking-tight">Sign in to your account</h2>
      <div className="space-y-6">
        <LoginForm />
        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <p className="text-sm text-muted-foreground">Or continue with</p>
          <Separator className="flex-1" />
        </div>
        <SocialAuth />
        <p className="text-center text-sm leading-6 text-muted-foreground">
          Not a member?{' '}
          <Link href="/register" className="font-semibold underline hover:text-primary">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
