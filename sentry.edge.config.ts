import * as Sentry from '@sentry/nextjs';

const isLocalDev = process.env.NODE_ENV === 'development';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  integrations: isLocalDev ? [] : [Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] })],
  tracesSampleRate: isLocalDev ? 0 : 0.2,
  enableLogs: !isLocalDev,
  sendDefaultPii: !isLocalDev
});
