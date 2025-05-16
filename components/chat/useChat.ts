'use client';

import { useCallback, useEffect, useState } from 'react';

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
};

interface UseChatProps {
  senderId: string;
  receiverId: string;
}

export function useChat({ receiverId }: UseChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch message history for this chat
  useEffect(() => {
    let isMounted = true;
    const fetchMessages = async () => {
      try {
        setError(null);
        const res = await fetch(`/api/chat/messages?receiverId=${receiverId}`);
        if (res.ok) {
          const msgs: Message[] = await res.json();
          if (isMounted) setMessages(msgs);
        } else {
          const errData = await res.json();
          if (isMounted) setError(errData.error || 'Failed to fetch messages');
        }
      } catch (err) {
        if (isMounted) setError('Failed to fetch messages');
      }
    };

    fetchMessages();

    return () => {
      isMounted = false;
    };
  }, [receiverId]);

  // Poll for new messages every 3 seconds (or use SWR for better experience)
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`/api/chat/messages?receiverId=${receiverId}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((msgs: Message[]) => setMessages(msgs))
        .catch(() => {});
    }, 3000);
    return () => clearInterval(interval);
  }, [receiverId]);

  // Send a new message
  const sendMessage = useCallback(async () => {
    const content = newMessage.trim();
    if (!content) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId, content })
      });
      setLoading(false);

      if (res.ok) {
        setNewMessage('');
        // Refresh after send
        fetch(`/api/chat/messages?receiverId=${receiverId}`)
          .then((res) => (res.ok ? res.json() : []))
          .then((msgs: Message[]) => setMessages(msgs))
          .catch(() => {});
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to send message');
      }
    } catch (err) {
      setLoading(false);
      setError('Failed to send message');
    }
  }, [newMessage, receiverId]);

  return {
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    loading,
    error
  };
}
