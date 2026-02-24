import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  try {
    const { searchParams, origin } = requestUrl;
    const code = searchParams.get('code');
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard/profile';

    if (!code) {
      logger.error('No code provided in OAuth callback');
      return NextResponse.redirect(`${origin}/auth/error?error=no_code`);
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      logger.error('Error exchanging code for session', { code, error: error.message, details: error });
      if (error.message.includes('validation_failed')) {
        return NextResponse.redirect(`${origin}/auth/error?error=validation_failed`);
      }
      return NextResponse.redirect(`${origin}/auth/error?error=exchange_failed`);
    }

    if (!data.session) {
      logger.error('No session data returned after code exchange');
      return NextResponse.redirect(`${origin}/auth/error?error=no_session`);
    }

    return NextResponse.redirect(`${origin}${next}`);
  } catch (error) {
    logger.error('Unexpected error in OAuth callback', {
      error: error instanceof Error ? error.message : String(error)
    });
    return NextResponse.redirect(`${requestUrl.origin}/auth/error?error=unexpected`);
  }
}
