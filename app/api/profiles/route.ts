import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

// read
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(null, { status: 403 });
  }

  const profiles = await prisma.profile.findMany({
    where: {
      userType: 'MENTOR'
    },
    select: {
      user: {
        select: {
          name: true,
          image: true
        }
      },
      bio: true,
      location: {
        select: {
          city: true,
          country: true
        }
      },
      profession: {
        select: {
          role: true,
          company: true
        }
      }
    }
  });

  return NextResponse.json(profiles);
}
