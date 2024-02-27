import { z } from 'zod';

export const registerFormSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email()
});

export type RegisterFormFields = z.infer<typeof registerFormSchema>;
