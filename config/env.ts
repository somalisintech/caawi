import { z } from 'zod';

const envSchema = z.object({
  CALENDLY_CLIENT_ID: z.string(),
  CALENDLY_CLIENT_SECRET: z.string()
});

export const env = envSchema.parse(process.env);
