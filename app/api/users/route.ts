import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const POST = withAxiom(async ({ json, log }: AxiomRequest) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorised' }, { status: 401, statusText: 'Unauthorised' });
  }

  const { firstName, lastName, bio, gender } = await json();

  const user = await prisma.user.update({
    where: {
      id: session.user.id
    },
    data: {
      firstName,
      lastName,
      profile: {
        update: {
          bio,
          gender
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
