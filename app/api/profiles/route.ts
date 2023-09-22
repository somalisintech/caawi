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
    select: {
      location: true,
      user: {
        select: {
          name: true,
          firstName: true,
          lastName: true,
          image: true,
          email: false,
          hashedPassword: false
        }
      }
    }
  });

  return NextResponse.json(profiles);
}

// create
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(null, { status: 403 });
  }

  const body = await request.json();
  const profile = await prisma.profile.create({
    data: {
      userId: session.user.id,
      ...body
    },
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

// update
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(null, { status: 403 });
  }

  const body = await request.json();
  const profile = await prisma.profile.update({
    where: { userId: session.user.id },
    data: {
      userId: session.user.id,
      ...body
    },
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
