import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.string().catch('development'),
  CALENDLY_CLIENT_ID: z.string(),
  CALENDLY_CLIENT_SECRET: z.string(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string()
});

export const env = envSchema.parse(process.env);
