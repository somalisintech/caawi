import { env } from '@/config/env-client';
import { createBrowserClient } from '@supabase/ssr';

// TODO: Figure out why client envs dont work after refresh
export function createClient() {
  const {
    NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  } = env;

  return createBrowserClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
