import { AxiomRequest, withAxiom } from 'next-axiom';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/db';

export const DELETE = withAxiom(async (req: AxiomRequest) => {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json({ message: 'Unauthorised' }, { status: 401, statusText: 'Unauthorised' });
  }

  await prisma.user.delete({ where: { email: data.user.email } });

  req.log.debug('User deleted', {
    userId: data.user.id
  });

  return NextResponse.json(data);
});

export const POST = withAxiom(async (req: AxiomRequest) => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!data.user || error) {
    return NextResponse.json({ message: 'Unauthorised' }, { status: 401, statusText: 'Unauthorised' });
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
    buyMeCoffeeUrl
  } = await req.json();

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
          location: country && {
            connectOrCreate: {
              where: {
                city_country: { city: city, country: country }
              },
              create: {
                country,
                city
              }
            }
          },
          occupation: role && {
            connectOrCreate: {
              where: {
                role_company: {
                  role: role,
                  company: company
                }
              },
              create: {
                role,
                company
              }
            }
          }
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
