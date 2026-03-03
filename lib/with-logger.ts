import * as Sentry from '@sentry/nextjs';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createClient } from '@/utils/supabase/server';

export type LoggerRequest = NextRequest & {
  log: typeof logger;
};

type RouteContext = { params: Promise<Record<string, string>> };

export function withLogger(handler: (req: LoggerRequest, context: RouteContext) => Promise<NextResponse>) {
  return async (req: NextRequest, context: RouteContext) => {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;
    const route = req.nextUrl.pathname;

    if (userId) {
      Sentry.setUser({ id: userId });
    }

    const scopedLog = {
      info: (msg: string, attrs?: Record<string, unknown>) => logger.info(msg, { userId, route, ...attrs }),
      warn: (msg: string, attrs?: Record<string, unknown>) => logger.warn(msg, { userId, route, ...attrs }),
      error: (msg: string, attrs?: Record<string, unknown>) => logger.error(msg, { userId, route, ...attrs }),
      debug: (msg: string, attrs?: Record<string, unknown>) => logger.debug(msg, { userId, route, ...attrs })
    };

    (req as LoggerRequest).log = scopedLog;

    try {
      return await handler(req as LoggerRequest, context);
    } catch (error) {
      scopedLog.error('Unhandled route error', {
        error: error instanceof Error ? error.message : String(error)
      });
      Sentry.captureException(error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  };
}
