'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { FaGithub, FaGoogle, FaLinkedin, FaTwitter } from 'react-icons/fa6';

const socialLogins = [
  {
    title: 'Sign in with Google',
    icon: FaGoogle,
    provider: 'google'
  },
  {
    title: 'Sign in with Twitter',
    icon: FaTwitter,
    provider: 'twitter'
  },
  {
    title: 'Sign in with GitHub',
    icon: FaGithub,
    provider: 'github'
  },
  {
    title: 'Sign in with LinkedIn',
    icon: FaLinkedin,
    provider: 'linkedin'
  }
];

export function SocialAuth() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {socialLogins.map((login) => (
        <Button
          key={login.provider}
          className="text-muted-foreground"
          variant="outline"
          title={login.title}
          onClick={() =>
            signIn(login.provider, {
              redirect: false,
              callbackUrl: '/dashboard'
            })
          }
        >
          <login.icon size={18} />
        </Button>
      ))}
    </div>
  );
}
