import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(null, { status: 403 });
  }

  const profile = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    include: {
      profile: true
    }
  });

  return NextResponse.json(profile);
}
