import { z } from 'zod';

export const calendlyEnvSchema = z.object({
  CALENDLY_CLIENT_ID: z.string(),
  CALENDLY_CLIENT_SECRET: z.string()
});
