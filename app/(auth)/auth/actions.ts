'use server';

import type { Provider } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { logger } from '@/lib/logger';
import { createClient } from '@/utils/supabase/server';
import { getUrl } from '@/utils/url';

export async function signInWithOtp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email');
  const next = formData.get('next');

  if (typeof email !== 'string' || !email) {
    logger.error('Invalid email provided for OTP sign in');
    return { error: 'Please provide a valid email address.' };
  }

  const callbackUrl = new URL(`${getUrl()}/api/auth/callback`);
  if (typeof next === 'string' && next) {
    callbackUrl.searchParams.set('next', next);
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: callbackUrl.toString()
    }
  });

  if (error) {
    logger.error('Error signing in with OTP', { error });
    return { error: 'Failed to sign in. Please try again.' };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function signInWithOAuth(formData: FormData) {
  const supabase = await createClient();

  const provider = formData.get('provider');
  const next = formData.get('next');

  if (typeof provider !== 'string' || !provider) {
    logger.error('Invalid provider for OAuth sign in');
    redirect('/auth/error?error=invalid_provider');
  }

  const callbackUrl = new URL(`${getUrl()}/api/auth/callback`);
  if (typeof next === 'string' && next) {
    callbackUrl.searchParams.set('next', next);
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as Provider,
    options: {
      redirectTo: callbackUrl.toString()
    }
  });

  if (error) {
    logger.error('Error signing in with OAuth', { error });
    redirect('/auth/error?error=provider_error');
  }

  if (!data.url) {
    logger.error('No URL returned from OAuth sign in');
    redirect('/auth/error?error=provider_error');
  }

  revalidatePath('/', 'layout');
  redirect(data.url);
}
