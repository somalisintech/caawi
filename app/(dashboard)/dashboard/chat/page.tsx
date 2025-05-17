import dynamic from 'next/dynamic';

const MentorMenteeChatPage = dynamic(() => import('@/components/chat/MentorMenteeChat'), { ssr: false });

export default function ChatPage() {
  return <MentorMenteeChatPage />;
}
