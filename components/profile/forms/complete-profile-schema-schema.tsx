import { z } from 'zod';
import { Gender, UserType } from '@/generated/prisma/browser';

export const completeProfileFormSchema = z
  .object({
    userType: z.enum(UserType, { error: 'Required' }),
    firstName: z.string().min(1, { error: 'First name is required' }),
    lastName: z.string().min(1, { error: 'Last name is required' }),
    email: z.email({ error: 'Please enter a valid email address' }),
    gender: z.enum(Gender, { error: 'Required' }),
    bio: z.string().optional()
  })
  .superRefine((data, ctx) => {
    if (data.userType === UserType.MENTOR && !data.bio) {
      ctx.addIssue({
        code: 'custom',
        path: ['bio'],
        message: 'Required',
        input: data.bio
      });
    }
  });

export type CompleteProfileFormFields = z.infer<typeof completeProfileFormSchema>;
