import bcrypt from 'bcrypt';
import prisma from '@/lib/db';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { NextResponse } from 'next/server';

export const POST = withAxiom(async ({ log, json }: AxiomRequest) => {
  const body = await json();
  const { firstName, lastName, email, password, userType } = body;

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ message: 'Missing Field' }, { status: 400, statusText: 'Missing Field' });
  }

  const exist = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (exist) {
    log.debug('Attempt to create user with existing email', {
      email
    });
    return NextResponse.json({ message: 'User already exists' }, { status: 409, statusText: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      email,
      hashedPassword,
      profile: {
        create: {
          userType
        }
      }
    },
    include: {
      profile: true
    }
  });

  log.info('New user registered', {
    userId: user.id,
    userType: user.profile.userType
  });

  return NextResponse.json(user, { status: 201 });
});
