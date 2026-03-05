import { z } from 'zod';
import { Gender, UserType } from '@/generated/prisma/browser';

export const profileFormSchema = z
  .object({
    userType: z.enum(UserType, { error: 'Required' }),
    firstName: z.string().min(1, { error: 'First name is required' }),
    lastName: z.string().min(1, { error: 'Last name is required' }),
    email: z.email({ error: 'Please enter a valid email address' }),
    gender: z.enum(Gender, { error: 'Required' }),
    bio: z.string(),
    yearsOfExperience: z.number().min(0).max(100).optional(),
    linkedInUrl: z.url().or(z.literal('')).optional(),
    githubUrl: z.url().or(z.literal('')).optional(),
    buyMeCoffeeUrl: z.url().or(z.literal('')).optional(),
    sameGenderPref: z.boolean().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    role: z.string().optional(),
    company: z.string().optional(),
    skills: z.array(z.string()).optional()
  })
  .superRefine((data, ctx) => {
    if (data.country && !data.city) {
      ctx.addIssue({
        code: 'custom',
        path: ['city'],
        message: 'Required',
        input: data.city
      });
    }
    if (data.role && !data.company) {
      ctx.addIssue({
        code: 'custom',
        path: ['company'],
        message: 'Required',
        input: data.company
      });
    }
  });

export type ProfileFormFields = z.infer<typeof profileFormSchema>;
