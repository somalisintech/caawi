import { z } from 'zod';

export const profileFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  gender: z.enum(['MALE', 'FEMALE'], {
    invalid_type_error: 'Required'
  }),
  bio: z.string(),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: 'Please enter a valid URL.' })
      })
    )
    .optional()
});

export type ProfileFormFields = z.infer<typeof profileFormSchema>;
