import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { receiverId, content } = await req.json();
  if (!receiverId || !content || typeof content !== 'string') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      senderId: session.user.id,
      receiverId,
      content
    }
  });

  return NextResponse.json(message);
}