'use client';
import { ChatPanel } from '@/components/chat/ChatPanel';

interface MentorChatSectionProps {
  conversationId: string;
  currentUserId: string;
}

export function MentorChatSection({ conversationId, currentUserId }: MentorChatSectionProps) {
  return (
    <div className="mt-8">
      <h3 className="mb-2 text-lg font-semibold">Chat with this mentor</h3>
      <ChatPanel conversationId={conversationId} currentUserId={currentUserId} />
    </div>
  );
}
