import { z } from 'zod';

export const completeProfileFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  gender: z.enum(['MALE', 'FEMALE'], {
    invalid_type_error: 'Required'
  }),
  bio: z.string()
});

export type CompleteProfileFormFields = z.infer<typeof completeProfileFormSchema>;
