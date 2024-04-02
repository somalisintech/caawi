'use client';

import { Button } from '@/components/ui/button';
import { Provider } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { FaGithub, FaGoogle, FaLinkedin } from 'react-icons/fa6';

const socialAuth = [
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
  const supabase = createClient();

  return (
    <div className="grid grid-cols-1 gap-3">
      {socialAuth.map((auth) => (
        <Button
          key={auth.provider}
          className="relative gap-2 text-muted-foreground"
          variant="outline"
          title={auth.title}
          onClick={async () => {
            await supabase.auth.signInWithOAuth({
              provider: auth.provider as Provider,
              options: {
                redirectTo: `${location.origin}/api/auth/callback`
              }
            });
          }}
        >
          <div className="absolute left-4">
            <auth.icon size={18} />
          </div>
          <div>{auth.title}</div>
        </Button>
      ))}
    </div>
  );
}
