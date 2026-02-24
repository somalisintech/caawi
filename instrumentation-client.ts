import * as Sentry from '@sentry/nextjs';

const isProduction = process.env.NODE_ENV === 'production';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      maskAllInputs: false,
      blockAllMedia: false
    })
  ],
  tracesSampleRate: isProduction ? 0.2 : 1.0,
  enableLogs: true,
  replaysSessionSampleRate: isProduction ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,
  sendDefaultPii: true
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
