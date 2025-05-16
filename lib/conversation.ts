import prisma from './db';

/**
 * Finds or creates a 1:1 conversation between two users and returns the conversation ID.
 */
export async function getOrCreateConversation(userAId: string, userBId: string): Promise<string> {
  // Sort IDs to ensure uniqueness regardless of order
  const [id1, id2] = [userAId, userBId].sort();

  // Try to find an existing conversation with exactly these two participants
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        every: {
          userId: { in: [id1, id2] }
        }
      }
    },
    include: {
      participants: true
    }
  });

  // Filter to only those with exactly two participants
  let conversation = conversations.find(
    (c) =>
      c.participants.length === 2 &&
      c.participants.some((p) => p.userId === id1) &&
      c.participants.some((p) => p.userId === id2)
  );

  // If not found, create it and fetch again with participants
  if (!conversation) {
    const created = await prisma.conversation.create({
      data: {
        participants: {
          create: [{ userId: id1 }, { userId: id2 }]
        }
      }
    });
    const fetched = await prisma.conversation.findUnique({
      where: { id: created.id },
      include: { participants: true }
    });
    conversation = fetched ?? undefined;
  }

  if (!conversation) throw new Error('Failed to create or fetch conversation');
  return conversation.id;
}
