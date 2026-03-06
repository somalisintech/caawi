'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { SKILL_TO_CATEGORY } from '@/lib/constants/skills';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

const emptyToNull = (v: unknown) => (v === '' ? null : v);
const optionalUrl = z.preprocess(emptyToNull, z.string().url().max(2048).optional().nullable());

const profileUpdateSchema = z.object({
  userType: z.enum(['MENTOR', 'MENTEE']).optional(),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  image: optionalUrl,
  gender: z.enum(['MALE', 'FEMALE']).optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
  sameGenderPref: z.boolean().optional(),
  isAcceptingMentees: z.boolean().optional(),
  onVacation: z.boolean().optional(),
  vacationEndsAt: z.preprocess(
    (v) => (typeof v === 'string' && v ? new Date(v) : v === '' ? null : v),
    z.date().optional().nullable()
  ),
  monthlyCapacity: z.number().int().min(1).max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  role: z.string().max(100).optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  yearsOfExperience: z.number().int().min(0).max(100).optional().nullable(),
  linkedInUrl: optionalUrl,
  githubUrl: optionalUrl,
  buyMeCoffeeUrl: optionalUrl,
  onboardingCompleted: z.boolean().optional(),
  skills: z.array(z.string().max(100)).optional()
});

type ProfileUpdateInput = Partial<Record<string, unknown>> & {
  userType?: 'MENTOR' | 'MENTEE';
  firstName?: string;
  lastName?: string;
  image?: string | null;
  gender?: 'MALE' | 'FEMALE' | null;
  bio?: string | null;
  sameGenderPref?: boolean;
  isAcceptingMentees?: boolean;
  onVacation?: boolean;
  vacationEndsAt?: Date | string | null;
  monthlyCapacity?: number | null;
  country?: string | null;
  city?: string | null;
  role?: string | null;
  company?: string | null;
  yearsOfExperience?: number | null;
  linkedInUrl?: string | null;
  githubUrl?: string | null;
  buyMeCoffeeUrl?: string | null;
  onboardingCompleted?: boolean;
  skills?: string[];
};

export async function deleteAccountAction() {
  try {
    const supabase = await createClient();
    const { data: authData, error } = await supabase.auth.getUser();

    if (!authData.user || error) {
      return { success: false, message: 'Unauthorised' };
    }

    await prisma.user.delete({
      where: { id: authData.user.id }
    });

    const adminClient = createAdminClient();
    const { error: adminErr } = await adminClient.auth.admin.deleteUser(authData.user.id);
    if (adminErr) {
      logger.error('Failed to delete Supabase auth user', { userId: authData.user.id, error: adminErr });
    }

    await supabase.auth.signOut();

    logger.info('User account deleted', { userId: authData.user.id });

    return { success: true, message: 'Account deleted' };
  } catch (error) {
    console.error('Failed to delete account:', error);
    return { success: false, message: 'Something went wrong' };
  }
}

export async function updateProfileAction(data: ProfileUpdateInput) {
  try {
    const supabase = await createClient();
    const { data: authData, error } = await supabase.auth.getUser();

    if (!authData.user || error) {
      return { success: false, message: 'Unauthorised' };
    }

    const parsed = profileUpdateSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, message: 'Invalid data' };
    }

    const {
      userType,
      firstName,
      lastName,
      image,
      gender,
      bio,
      sameGenderPref,
      isAcceptingMentees,
      onVacation,
      vacationEndsAt,
      monthlyCapacity,
      country,
      city,
      role,
      company,
      yearsOfExperience,
      linkedInUrl,
      githubUrl,
      buyMeCoffeeUrl,
      onboardingCompleted,
      skills
    } = parsed.data;

    await prisma.user.update({
      where: { email: authData.user.email },
      data: {
        firstName,
        lastName,
        image,
        profile: {
          update: {
            bio,
            gender,
            userType,
            sameGenderPref,
            isAcceptingMentees,
            onVacation,
            vacationEndsAt,
            monthlyCapacity,
            yearsOfExperience,
            linkedInUrl,
            githubUrl,
            buyMeCoffeeUrl,
            onboardingCompleted,
            ...(skills !== undefined && {
              skills: {
                set: [],
                connectOrCreate: skills.map((name) => ({
                  where: { name },
                  create: { name, category: SKILL_TO_CATEGORY[name] ?? 'Other' }
                }))
              }
            }),
            location: country
              ? {
                  connectOrCreate: {
                    where: { city_country: { city: city ?? '', country } },
                    create: { country, city: city ?? '' }
                  }
                }
              : undefined,
            occupation: role
              ? {
                  connectOrCreate: {
                    where: { role_company: { role, company: company ?? '' } },
                    create: { role, company: company ?? '' }
                  }
                }
              : undefined
          }
        }
      }
    });

    logger.debug('User profile updated', { userId: authData.user.id });

    revalidatePath('/dashboard/profile');
    revalidatePath('/dashboard');
    return { success: true, message: 'Updated' };
  } catch (error) {
    console.error('Failed to update profile:', error);
    return { success: false, message: 'Something went wrong' };
  }
}
