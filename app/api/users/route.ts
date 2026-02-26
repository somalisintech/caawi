import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@/generated/prisma/client';
import { SKILL_TO_CATEGORY } from '@/lib/constants/skills';
import prisma from '@/lib/db';
import { type LoggerRequest, withLogger } from '@/lib/with-logger';
import { createClient } from '@/utils/supabase/server';

const profileUpdateSchema = z.object({
  userType: z.enum(['MENTOR', 'MENTEE']).optional(),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  image: z.string().url().max(2048).optional().nullable(),
  gender: z.enum(['MALE', 'FEMALE']).optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
  sameGenderPref: z.boolean().optional(),
  country: z.string().max(100).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  role: z.string().max(100).optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  yearsOfExperience: z.number().int().min(0).max(100).optional().nullable(),
  linkedInUrl: z.string().url().max(2048).optional().nullable(),
  githubUrl: z.string().url().max(2048).optional().nullable(),
  buyMeCoffeeUrl: z.string().url().max(2048).optional().nullable(),
  onboardingCompleted: z.boolean().optional(),
  skills: z.array(z.string().max(100)).optional()
});

export const DELETE = withLogger(async (req: LoggerRequest) => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json({ message: 'Unauthorised' }, { status: 401, statusText: 'Unauthorised' });
  }

  try {
    await prisma.user.delete({ where: { email: data.user.email } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    throw error;
  }

  req.log.debug('User deleted', {
    userId: data.user.id
  });

  return NextResponse.json(data);
});

export const POST = withLogger(async (req: LoggerRequest) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!data.user || error) {
    return NextResponse.json({ message: 'Unauthorised' }, { status: 401, statusText: 'Unauthorised' });
  }

  const body = await req.json();
  const parsed = profileUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const {
    userType,
    firstName,
    lastName,
    image,
    gender,
    bio,
    sameGenderPref,
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

  const user = await prisma.user.update({
    where: {
      email: data.user.email
    },
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
                  where: {
                    city_country: { city: city ?? '', country: country }
                  },
                  create: {
                    country,
                    city
                  }
                }
              }
            : undefined,
          occupation: role
            ? {
                connectOrCreate: {
                  where: {
                    role_company: {
                      role: role,
                      company: company ?? ''
                    }
                  },
                  create: {
                    role,
                    company
                  }
                }
              }
            : undefined
        }
      }
    },
    select: {
      firstName: true,
      lastName: true,
      profile: true,
      updatedAt: true
    }
  });

  req.log.debug('User profile updated', {
    userId: data.user.id
  });

  return NextResponse.json(user);
});
