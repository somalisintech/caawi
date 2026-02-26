import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Calendly webhook is called by Calendly servers, not authenticated users
  if (request.nextUrl.pathname === '/api/calendly/webhook') {
    return NextResponse.next();
  }

  return await updateSession(request);
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*', '/onboarding']
};
