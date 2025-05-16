import { AxiomRequest, withAxiom } from 'next-axiom';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/db';

// PATCH: Mark a message as read
export const PATCH = withAxiom(async (req: AxiomRequest, { params }: { params: { id: string } }) => {
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    const currentUser = data.user;

    if (!currentUser) {
      req.log.warn('Unauthorized attempt to mark message as read');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messageId = params.id;
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { conversation: { include: { participants: true } } }
    });

    if (!message) {
      req.log.warn('Message not found', { messageId });
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    // Ensure user is a participant in the conversation
    const isParticipant = message.conversation.participants.some((p) => p.userId === currentUser.id);
    if (!isParticipant) {
      req.log.warn('User is not a participant in conversation', {
        userId: currentUser.id,
        conversationId: message.conversation.id
      });
      return NextResponse.json({ error: 'You are not a participant in this conversation' }, { status: 403 });
    }

    // Update the readAt field
    const updated = await prisma.message.update({
      where: { id: messageId },
      data: { readAt: new Date() }
    });

    req.log.info('Message marked as read', { userId: currentUser.id, messageId });
    return NextResponse.json(updated);
  } catch (error) {
    req.log.error('Error in PATCH /chat/message/[id]', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
