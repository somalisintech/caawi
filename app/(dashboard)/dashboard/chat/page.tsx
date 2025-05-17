import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import { ChatInbox } from '@/components/chat/ChatInbox';

export default async function ChatPage() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (!data.user || error) {
    redirect('/auth');
  }

  // Get the current user from Prisma
  const user = await prisma.user.findUnique({
    where: { email: data.user.email },
    select: { id: true, firstName: true, lastName: true, email: true, image: true }
  });
  if (!user) {
    redirect('/auth');
  }

  // Fetch all conversations for the user
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: { userId: user.id }
      }
    },
    include: {
      participants: {
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, image: true } }
        }
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    orderBy: { updatedAt: 'desc' }
  });

  // Prepare data for the client component
  const chatList: {
    id: string;
    otherUser: { id: string; name: string; image?: string | null };
    lastMessage: { content: string; createdAt: string } | null;
  }[] = conversations
    .map((conv) => {
      // Find the other participant (not the current user)
      const otherParticipant = conv.participants.find((p) => p.userId !== user.id);
      if (!otherParticipant || !otherParticipant.user) return null;

      const otherUser = otherParticipant.user;
      const name = [otherUser.firstName, otherUser.lastName].filter(Boolean).join(' ') || otherUser.email || 'Unknown';

      const lastMsg = conv.messages[0];
      const lastMessage = lastMsg
        ? {
            content: lastMsg.content,
            createdAt: typeof lastMsg.createdAt === 'string' ? lastMsg.createdAt : lastMsg.createdAt.toISOString()
          }
        : null;

      return {
        id: conv.id,
        otherUser: {
          id: otherUser.id,
          name,
          image: otherUser.image || null
        },
        lastMessage
      };
    })
    .filter(Boolean) as {
    id: string;
    otherUser: { id: string; name: string; image?: string | null };
    lastMessage: { content: string; createdAt: string } | null;
  }[];

  return <ChatInbox userId={user.id} chatList={chatList} />;
}
