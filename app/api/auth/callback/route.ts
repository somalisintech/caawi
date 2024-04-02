import { AxiomRequest, withAxiom } from 'next-axiom';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export const GET = withAxiom(async ({ url }: AxiomRequest) => {
  const requestUrl = new URL(url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}/dashboard`);
});
