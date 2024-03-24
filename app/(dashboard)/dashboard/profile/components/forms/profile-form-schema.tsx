import { z } from 'zod';
import { Gender } from '@prisma/client';

export const profileFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  gender: z.nativeEnum(Gender, { invalid_type_error: 'Required' }),
  bio: z.string(),
  linkedinUrl: z.string().url().or(z.literal('')),
  githubUrl: z.string().url().or(z.literal('')),
  sameGenderPref: z.boolean().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  role: z.string().optional(),
  company: z.string().optional(),
  yearsOfExperience: z.coerce.number().min(0).max(100).optional()
});

export type ProfileFormFields = z.infer<typeof profileFormSchema>;
