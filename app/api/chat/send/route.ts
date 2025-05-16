import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { receiverId, content } = await req.json();
    if (!receiverId || !content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        senderId: user.id,
        receiverId,
        content
      }
    });

    return NextResponse.json(message);
  } catch (err) {
    console.error('Error sending chat message:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
