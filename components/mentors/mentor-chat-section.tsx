'use client';
import { MentorMenteeChat } from '@/components/chat/MentorMenteeChat';

interface MentorChatSectionProps {
  conversationId: string;
  currentUserId: string;
}

export function MentorChatSection({ conversationId, currentUserId }: MentorChatSectionProps) {
  return (
    <div className="mt-8">
      <h3 className="mb-2 text-lg font-semibold">Chat with this mentor</h3>
      <MentorMenteeChat conversationId={conversationId} currentUserId={currentUserId} showSidebar={false} />
    </div>
  );
}
