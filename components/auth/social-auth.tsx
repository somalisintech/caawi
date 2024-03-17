'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { FaGithub, FaGoogle, FaLinkedin } from 'react-icons/fa6';

const socialLogins = [
  {
    title: 'Continue with Google',
    icon: FaGoogle,
    provider: 'google'
  },
  {
    title: 'Continue with GitHub',
    icon: FaGithub,
    provider: 'github'
  },
  {
    title: 'Continue with LinkedIn',
    icon: FaLinkedin,
    provider: 'linkedin'
  }
];

export function SocialAuth() {
  const params = useSearchParams();

  return (
    <div className="grid grid-cols-1 gap-3">
      {socialLogins.map((login) => (
        <Button
          key={login.provider}
          className="relative gap-2 text-muted-foreground"
          variant="outline"
          title={login.title}
          onClick={() =>
            signIn(login.provider, {
              redirect: false,
              callbackUrl: params.get('callbackUrl') || '/dashboard'
            })
          }
        >
          <div className="absolute left-4">
            <login.icon size={18} />
          </div>
          <div>{login.title}</div>
        </Button>
      ))}
    </div>
  );
}
