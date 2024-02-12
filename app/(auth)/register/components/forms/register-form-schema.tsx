import { z } from 'zod';
import { UserType } from '@prisma/client';

export const registerFormSchema = z
  .object({
    userType: z.nativeEnum(UserType),
    firstName: z.string().min(1, { message: 'First Name is required' }),
    lastName: z.string().min(1, { message: 'Last Name is required' }),
    email: z.string().min(1, { message: 'Email is required' }).email(),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    confirm: z.string()
  })
  .refine(({ password, confirm }) => password === confirm, {
    message: "Passwords don't match",
    path: ['confirm']
  });

export type RegisterFormValidation = z.infer<typeof registerFormSchema>;
