import { z } from 'zod';

export const authFormSchema = z.object({
  email: z.email({ error: 'A valid email is required' })
});

export type AuthFormFields = z.infer<typeof authFormSchema>;
