import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(null, { status: 403 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: {
      location: true,
      user: {
        select: {
          name: true,
          firstName: true,
          lastName: true,
          email: true,
          image: true,
          hashedPassword: false
        }
      }
    }
  });

  return NextResponse.json(profile);
}
