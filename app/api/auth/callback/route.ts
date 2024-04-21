import { AxiomRequest, withAxiom } from 'next-axiom';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export const GET = withAxiom(async ({ url }: AxiomRequest) => {
  const requestUrl = new URL(url);
  const origin = requestUrl.origin;
  const code = requestUrl.searchParams.get('code');
  const redirectUrl = requestUrl.searchParams.get('redirectUrl') || `${origin}/dashboard`;

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(redirectUrl);
});
