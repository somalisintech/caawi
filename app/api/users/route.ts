import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
  }

  const body = await request.json();

  const user = await prisma.user.update({
    where: {
      id: session.user.id
    },
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      profile: {
        update: {
          bio: body.bio,
          gender: body.profile.gender
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
