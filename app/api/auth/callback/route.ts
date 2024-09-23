import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { log } from 'next-axiom';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  try {
    const { searchParams, origin } = requestUrl;
    const code = searchParams.get('code');
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard/profile';

    if (!code) {
      log.error('No code provided in OAuth callback');
      return NextResponse.redirect(`${origin}/auth/error?error=no_code`);
    }

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          }
        }
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      log.error('Error exchanging code for session', { code, error: error.message, details: error });
      if (error.message.includes('validation_failed')) {
        return NextResponse.redirect(`${origin}/auth/error?error=validation_failed`);
      }
      return NextResponse.redirect(`${origin}/auth/error?error=exchange_failed`);
    }

    if (!data.session) {
      log.error('No session data returned after code exchange');
      return NextResponse.redirect(`${origin}/auth/error?error=no_session`);
    }

    return NextResponse.redirect(`${origin}${next}`);
  } catch (error) {
    log.error('Unexpected error in OAuth callback', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.redirect(`${requestUrl.origin}/auth/error?error=unexpected`);
  }
}
