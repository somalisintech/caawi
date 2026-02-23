'use server';

import type { Provider } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { log } from 'next-axiom';
import { createClient } from '@/utils/supabase/server';
import { getUrl } from '@/utils/url';

export async function signInWithOtp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email');

  if (typeof email !== 'string' || !email) {
    log.error('Invalid email provided for OTP sign in');
    return { error: 'Please provide a valid email address.' };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email
  });

  if (error) {
    log.error('Error signing in with OTP', { error });
    return { error: 'Failed to sign in. Please try again.' };
  }

  revalidatePath('/', 'layout');
  redirect('/check-email');
}

export async function signInWithOAuth(formData: FormData) {
  const supabase = await createClient();

  const provider = formData.get('provider');

  if (typeof provider !== 'string' || !provider) {
    log.error('Invalid provider for OAuth sign in');
    redirect('/error');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as Provider,
    options: {
      redirectTo: `${getUrl()}/api/auth/callback`
    }
  });

  if (error) {
    log.error('Error signing in with OAuth', { error });
    redirect('/error');
  }

  if (!data.url) {
    log.error('No URL returned from OAuth sign in');
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect(data.url);
}
