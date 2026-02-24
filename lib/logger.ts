import * as Sentry from '@sentry/nextjs';

type LogAttributes = Record<string, unknown>;

export const logger = {
  info(message: string, attrs?: LogAttributes) {
    Sentry.logger.info(message, attrs);
  },
  warn(message: string, attrs?: LogAttributes) {
    Sentry.logger.warn(message, attrs);
  },
  error(message: string, attrs?: LogAttributes) {
    Sentry.logger.error(message, attrs);
  },
  debug(message: string, attrs?: LogAttributes) {
    Sentry.logger.debug(message, attrs);
  }
};
