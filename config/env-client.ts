import { z } from 'zod';

// TODO: These are unset at runtime, hence the optional validation
const envSchema = z.object({
  NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),

  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional()
});

export const env = envSchema.parse(process.env);
