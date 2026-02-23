import { z } from 'zod';
import { Gender, UserType } from '@/generated/prisma/browser';

export const completeProfileFormSchema = z
  .object({
    userType: z.nativeEnum(UserType, { invalid_type_error: 'Required' }),
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    gender: z.nativeEnum(Gender, { invalid_type_error: 'Required' }),
    bio: z.string().optional()
  })
  .superRefine((data, ctx) => {
    if (data.userType === UserType.MENTOR && !data.bio) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['bio'],
        message: 'Required'
      });
    }
  });

export type CompleteProfileFormFields = z.infer<typeof completeProfileFormSchema>;
