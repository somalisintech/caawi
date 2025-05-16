import { AxiomRequest, withAxiom } from 'next-axiom';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/db';

// POST: Send a message in a conversation
export const POST = withAxiom(async (req: AxiomRequest, { params }: { params: { id: string } }) => {
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    const currentUser = data.user;

    if (!currentUser) {
      req.log.warn('Unauthorized attempt to send message');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversationId = params.id;
    const { content } = await req.json();
    if (!content || typeof content !== 'string') {
      req.log.warn('Missing or invalid message content', { userId: currentUser.id });
      return NextResponse.json({ error: 'Missing or invalid message content' }, { status: 400 });
    }

    // Find the participant record for the current user in this conversation
    const participant = await prisma.participant.findFirst({
      where: {
        userId: currentUser.id,
        conversationId
      }
    });

    if (!participant) {
      req.log.warn('User is not a participant in conversation', { userId: currentUser.id, conversationId });
      return NextResponse.json({ error: 'You are not a participant in this conversation' }, { status: 403 });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: participant.id,
        content
      }
    });

    req.log.info('Message sent', { userId: currentUser.id, conversationId, messageId: message.id });
    return NextResponse.json(message);
  } catch (error) {
    req.log.error('Error in POST /chat/conversation/[id]/messages', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// GET: List messages in a conversation (paginated)
export const GET = withAxiom(async (req: AxiomRequest, { params }: { params: { id: string } }) => {
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    const currentUser = data.user;

    if (!currentUser) {
      req.log.warn('Unauthorized attempt to list messages');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversationId = params.id;
    // Optional: pagination via query params
    const { searchParams } = new URL(req.url);
    const take = parseInt(searchParams.get('take') || '50', 10); // default 50
    const skip = parseInt(searchParams.get('skip') || '0', 10);

    // Ensure user is a participant
    const participant = await prisma.participant.findFirst({
      where: {
        userId: currentUser.id,
        conversationId
      }
    });

    if (!participant) {
      req.log.warn('User is not a participant in conversation', { userId: currentUser.id, conversationId });
      return NextResponse.json({ error: 'You are not a participant in this conversation' }, { status: 403 });
    }

    // Get messages
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      skip,
      take
    });

    req.log.info('Listed messages', { userId: currentUser.id, conversationId, count: messages.length });
    return NextResponse.json(messages);
  } catch (error) {
    req.log.error('Error in GET /chat/conversation/[id]/messages', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
