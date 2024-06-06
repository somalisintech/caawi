import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { log } from 'next-axiom';

export const GET = async (request: NextRequest) => {
  log.info('Auth callback', {
    request
  });

  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const code = requestUrl.searchParams.get('code');
  const redirectUrl = requestUrl.searchParams.get('redirectUrl') || `${origin}/dashboard`;

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(redirectUrl);
};
