import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  integrations: [Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] })],
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
  enableLogs: true,
  sendDefaultPii: true
});
