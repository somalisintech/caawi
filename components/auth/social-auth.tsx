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

export function SocialAuth() {
  const [loading, setLoading] = useState<Provider | null>();

  return (
    <form className="grid grid-cols-1 gap-3">
      {socialAuth.map((auth) => (
        <Button
          key={auth.provider}
          className="relative gap-2 text-muted-foreground"
          variant="outline"
          title={auth.title}
          onClick={() => setLoading(auth.provider)}
          formAction={(formData) => {
            formData.set('provider', auth.provider);
            return signInWithOAuth(formData);
          }}
        >
          <div className="absolute left-4">
            {loading === auth.provider ? <Loader2 className="animate-spin" size={18} /> : <auth.icon size={18} />}
          </div>
          <div>{auth.title}</div>
        </Button>
      ))}
    </form>
  );
}
