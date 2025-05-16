import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const receiverId = searchParams.get('receiverId');
    const supabase = createClient();

    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    if (!user?.id || !receiverId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const senderId = user.id;

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
  } catch (err) {
    console.error('Error fetching chat messages:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}