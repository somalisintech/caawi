'use client';

import posthog from 'posthog-js';
import { env } from '@/config/env';
import { PropsWithChildren } from 'react';
import { PostHogProvider } from 'posthog-js/react';

const { NEXT_PUBLIC_POSTHOG_HOST, NEXT_PUBLIC_POSTHOG_KEY } = env;

if (typeof window !== 'undefined') {
  posthog.init(NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: NEXT_PUBLIC_POSTHOG_HOST
  });
}

export const CSPostHogProvider = ({ children }: PropsWithChildren) => <PostHogProvider>{children}</PostHogProvider>;
