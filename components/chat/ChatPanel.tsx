'use client';

import { useEffect, useRef, useState } from 'react';
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages';
import { cn } from '@/lib/utils';

interface ChatPanelProps {
  conversationId: string;
  currentUserId: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  read: boolean;
}

export function ChatPanel({ conversationId, currentUserId }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Subscribe to real-time messages
  useRealtimeMessages(conversationId, (newMessage: unknown) => {
    setMessages((prev) => [...prev, newMessage as Message]);
  });

  // Fetch initial messages
  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      try {
        // Use the correct API path (no 's' in 'conversation')
        const res = await fetch(`/api/chat/conversation/${conversationId}/messages`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, [conversationId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/chat/conversation/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input })
      });
      if (res.ok) {
        const newMessage = await res.json();
        setInput('');
        setMessages((prev) => [...prev, newMessage]);
        // Message will also be added via realtime subscription, but this ensures instant feedback
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-96 flex-col rounded-lg border bg-white shadow-sm">
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {loading && messages.length === 0 ? (
          <div className="text-center text-gray-400">Loading messages...</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'max-w-xs px-4 py-2 rounded-lg',
                msg.senderId === currentUserId ? 'ml-auto bg-blue-500 text-white' : 'mr-auto bg-gray-200 text-gray-900'
              )}
            >
              <div className="text-sm">{msg.content}</div>
              <div className="mt-1 text-right text-xs opacity-60">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form
        className="flex items-center gap-2 border-t p-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          className="flex-1 rounded border px-3 py-2 focus:outline-none focus:ring"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
