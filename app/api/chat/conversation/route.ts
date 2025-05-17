import { AxiomRequest, withAxiom } from 'next-axiom';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/db';

// POST: Get or create a conversation between the authenticated user and another user
export const POST = withAxiom(async (req: AxiomRequest) => {
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    const currentUser = data.user;

    if (!currentUser) {
      req.log.warn('Unauthorized attempt to create/get conversation');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { otherUserId } = await req.json();
    if (!otherUserId || typeof otherUserId !== 'string') {
      req.log.warn('Missing or invalid otherUserId', { userId: currentUser.id });
      return NextResponse.json({ error: 'Missing or invalid otherUserId' }, { status: 400 });
    }

    let conversation = await prisma.conversation.findFirst({
      where: {
        participants: {
          some: { userId: currentUser.id }
        },
        AND: {
          participants: {
            some: { userId: otherUserId }
          }
        }
      },
      include: { participants: true }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participants: {
            create: [{ user: { connect: { id: currentUser.id } } }, { user: { connect: { id: otherUserId } } }]
          }
        },
        include: { participants: true }
      });
      req.log.info('Created new conversation', {
        userId: currentUser.id,
        otherUserId,
        conversationId: conversation.id
      });
    } else {
      req.log.info('Fetched existing conversation', {
        userId: currentUser.id,
        otherUserId,
        conversationId: conversation.id
      });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    req.log.error('Error in POST /chat/conversation', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// GET: List all conversations for the authenticated user
export const GET = withAxiom(async (req: AxiomRequest) => {
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    const currentUser = data.user;

    if (!currentUser) {
      req.log.warn('Unauthorized attempt to list conversations');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId: currentUser.id }
        }
      },
      include: {
        participants: {
          include: { user: { include: { profile: true } } }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    req.log.info('Listed conversations', { userId: currentUser.id, count: conversations.length });
    return NextResponse.json(conversations);
  } catch (error) {
    req.log.error('Error in GET /chat/conversation', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
