'use client';

import { Button } from '@/components/ui/button';
import { Provider } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { FaGithub, FaGoogle, FaLinkedin } from 'react-icons/fa6';
import { IconType } from 'react-icons/lib';
import { useState } from 'react';
import { toast } from '../ui/use-toast';
import { Loader2 } from 'lucide-react';
import { getUrl } from '@/utils/url';

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

type Props = {
  redirectUrl?: string;
};

export function SocialAuth({ redirectUrl = `${getUrl()}/dashboard` }: Props) {
  const [loading, setLoading] = useState<Provider | null>();
  const supabase = createClient();

  const signIn = async (auth: Auth) => {
    try {
      setLoading(auth.provider);
      await supabase.auth.signInWithOAuth({
        provider: auth.provider as Provider,
        options: {
          redirectTo: `${getUrl()}/api/auth/callback?redirectUrl=${redirectUrl}`
        }
      });
    } catch (err) {
      toast({
        title: 'Failed to authenticate',
        variant: 'destructive'
      });
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {socialAuth.map((auth) => (
        <Button
          key={auth.provider}
          className="relative gap-2 text-muted-foreground"
          variant="outline"
          title={auth.title}
          onClick={() => signIn(auth)}
        >
          <div className="absolute left-4">
            {loading === auth.provider ? <Loader2 className="animate-spin" size={18} /> : <auth.icon size={18} />}
          </div>
          <div>{auth.title}</div>
        </Button>
      ))}
    </div>
  );
}
