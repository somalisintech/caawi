import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorised' }, { status: 401, statusText: 'Unauthorised' });
  }

  const { firstName, lastName, bio, gender } = await request.json();

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

  return NextResponse.json(user);
}
