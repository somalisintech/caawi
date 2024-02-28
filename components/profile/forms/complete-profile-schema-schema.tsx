import { z } from 'zod';
import { Gender, UserType } from '@prisma/client';

export const completeProfileFormSchema = z.object({
  userType: z.nativeEnum(UserType, { invalid_type_error: 'Required' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  gender: z.nativeEnum(Gender, {
    invalid_type_error: 'Required'
  }),
  bio: z.string().optional()
});

export type CompleteProfileFormFields = z.infer<typeof completeProfileFormSchema>;
