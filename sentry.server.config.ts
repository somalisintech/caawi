import * as Sentry from '@sentry/nextjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

const isLocalDev = process.env.NODE_ENV === 'development';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  integrations: [
    nodeProfilingIntegration(),
    ...(isLocalDev ? [] : [Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] })])
  ],
  tracesSampleRate: isLocalDev ? 0 : 0.2,
  profileSessionSampleRate: isLocalDev ? 0 : 0.2,
  profileLifecycle: 'trace',
  enableLogs: !isLocalDev,
  sendDefaultPii: !isLocalDev
});
