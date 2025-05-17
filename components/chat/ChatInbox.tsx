'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ChatPanel } from '@/components/chat/ChatPanel';

interface ChatInboxProps {
  userId: string;
  chatList: {
    id: string;
    otherUser: { id: string; name: string; image?: string | null };
    lastMessage: { content: string; createdAt: string } | null;
  }[];
}

export function ChatInbox({ userId, chatList }: ChatInboxProps) {
  const [selectedId, setSelectedId] = useState(chatList[0]?.id || null);
  const selected = chatList.find((c) => c.id === selectedId);

  return (
    <div className="mx-auto flex h-[80vh] w-full max-w-5xl overflow-hidden rounded-lg border bg-white shadow-lg">
      {/* Sidebar */}
      <aside className="flex w-72 flex-col border-r bg-gray-50">
        <div className="border-b p-4 text-lg font-bold">Chats</div>
        <div className="flex-1 overflow-y-auto">
          {chatList.length === 0 ? (
            <div className="p-4 text-center text-gray-400">No conversations yet.</div>
          ) : (
            chatList.map((chat) => (
              <button
                key={chat.id}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-blue-100 ${selectedId === chat.id ? 'bg-blue-50' : ''}`}
                onClick={() => setSelectedId(chat.id)}
              >
                <Image
                  src={chat.otherUser.image || '/avatar-placeholder.png'}
                  alt={chat.otherUser.name}
                  width={40}
                  height={40}
                  className="rounded-full border object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{chat.otherUser.name}</div>
                  <div className="truncate text-xs text-gray-500">
                    {chat.lastMessage ? chat.lastMessage.content : 'No messages yet'}
                  </div>
                </div>
                {/* Optionally, show time or unread badge here */}
              </button>
            ))
          )}
        </div>
      </aside>
      {/* Main Chat Area */}
      <main className="flex flex-1 flex-col">
        {selected ? (
          <div className="flex flex-1 flex-col">
            <div className="flex items-center gap-3 border-b p-4">
              <Image
                src={selected.otherUser.image || '/avatar-placeholder.png'}
                alt={selected.otherUser.name}
                width={40}
                height={40}
                className="rounded-full border object-cover"
              />
              <div className="text-lg font-semibold">{selected.otherUser.name}</div>
            </div>
            <div className="flex-1 bg-gray-50 p-4">
              <ChatPanel conversationId={selected.id} currentUserId={userId} />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-400">
            Select a conversation to start chatting
          </div>
        )}
      </main>
    </div>
  );
}
