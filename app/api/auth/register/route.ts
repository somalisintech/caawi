import bcrypt from 'bcrypt';
import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { firstName, lastName, email, password } = body;

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ message: 'Missing Field' }, { status: 400, statusText: 'Missing Field' });
  }

  const exist = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (exist) {
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
        create: {}
      }
    },
    include: {
      profile: true
    }
  });

  return NextResponse.json(user, { status: 201 });
}
