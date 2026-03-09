'use client';

import type { Provider } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { FaGithub, FaGoogle, FaLinkedin } from 'react-icons/fa6';
import type { IconType } from 'react-icons/lib';
import { signInWithOAuth } from '@/app/(auth)/auth/actions';
import { Button } from '@/components/ui/button';

type Auth = {
  title: string;
  icon: IconType;
  provider: Provider;
};

const socialAuth: Auth[] = [
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
    provider: 'linkedin_oidc'
  }
];

export function SocialAuth({ next }: { next?: string }) {
  const [loading, setLoading] = useState<Provider | null>();

  return (
    <form className="grid w-full grid-cols-1 gap-2">
      {socialAuth.map((auth) => (
        <Button
          key={auth.provider}
          className="relative gap-2 text-muted-foreground"
          variant="outline"
          size="sm"
          title={auth.title}
          onClick={() => setLoading(auth.provider)}
          formAction={(formData) => {
            formData.set('provider', auth.provider);
            if (next) formData.set('next', next);
            return signInWithOAuth(formData);
          }}
        >
          <div className="absolute left-3">
            {loading === auth.provider ? <Loader2 className="animate-spin" size={16} /> : <auth.icon size={16} />}
          </div>
          <div className="text-sm">{auth.title}</div>
        </Button>
      ))}
    </form>
  );
}
