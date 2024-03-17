import { z } from 'zod';

export const authFormSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email()
});

export type AuthFormFields = z.infer<typeof authFormSchema>;
