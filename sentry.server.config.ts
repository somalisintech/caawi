import * as Sentry from '@sentry/nextjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
  profileSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
  profileLifecycle: 'trace',
  enableLogs: true,
  sendDefaultPii: true
});
