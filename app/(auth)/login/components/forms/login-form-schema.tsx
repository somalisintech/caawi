import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email()
});

export type LoginFormFields = z.infer<typeof loginFormSchema>;
