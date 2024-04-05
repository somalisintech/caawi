import { AxiomRequest, withAxiom } from 'next-axiom';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/db';

export const POST = withAxiom(async ({ json, log }: AxiomRequest) => {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ message: 'Unauthorised' }, { status: 401, statusText: 'Unauthorised' });
  }

  const {
    userType,
    firstName,
    lastName,
    email,
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
    buyMeCoffeeUrl
  } = await json();

  const isProfileComplete = !!(firstName && lastName && email && gender);

  const hasLocation = !!country;
  const hasOccupation = !!role;

  const user = await prisma.user.update({
    where: {
      id: userData.user.id
    },
    data: {
      firstName,
      lastName,
      profile: {
        update: {
          bio,
          gender,
          userType,
          sameGenderPref,
          isComplete: isProfileComplete,
          linkedInUrl,
          githubUrl,
          buyMeCoffeeUrl,
          ...(hasLocation
            ? {
                location: {
                  upsert: {
                    where: {
                      country,
                      city
                    },
                    create: {
                      country,
                      city
                    },
                    update: {
                      country,
                      city
                    }
                  }
                }
              }
            : {}),
          ...(hasOccupation
            ? {
                occupation: {
                  upsert: {
                    where: {
                      role,
                      company,
                      yearsOfExperience
                    },
                    create: {
                      role,
                      company,
                      yearsOfExperience
                    },
                    update: {
                      role,
                      company,
                      yearsOfExperience
                    }
                  }
                }
              }
            : {})
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

  log.debug('User profile updated', {
    userId: userData.user.id
  });

  return NextResponse.json(user);
});
