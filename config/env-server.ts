import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.string().catch('development'),

  CALENDLY_CLIENT_ID: z.string(),
  CALENDLY_CLIENT_SECRET: z.string(),

  NEXT_PUBLIC_SUPABASE_URL: z.string(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string()
});

export const env = envSchema.parse(process.env);
