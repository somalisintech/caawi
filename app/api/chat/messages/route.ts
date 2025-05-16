import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const receiverId = searchParams.get('receiverId');
  const session = await getServerSession();

  if (!session || !session.user?.id || !receiverId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only allow fetching messages between authenticated user and the receiver
  const senderId = session.user.id;

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    },
    orderBy: { createdAt: 'asc' }
  });

  return NextResponse.json(messages);
}