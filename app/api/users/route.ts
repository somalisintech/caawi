import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const POST = withAxiom(async ({ json, log }: AxiomRequest) => {
  const session = await getServerSession(authOptions);

  if (!session) {
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
    yearsOfExperience
  } = await json();

  const isProfileComplete = !!(firstName && lastName && email && gender);

  const hasLocation = !!country;
  const hasOccupation = !!role;

  const user = await prisma.user.update({
    where: {
      id: session.user.id
    },
    data: {
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      profile: {
        update: {
          bio,
          gender,
          userType,
          sameGenderPref,
          isComplete: isProfileComplete,
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
    userId: session.user.id
  });

  return NextResponse.json(user);
});
