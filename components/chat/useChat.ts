'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
};

interface UseChatProps {
  senderId: string;
  receiverId: string;
}

export function useChat({ senderId, receiverId }: UseChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  // Fetch message history for this chat
  useEffect(() => {
    let isMounted = true;
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`
        )
        .order('created_at', { ascending: true });

      if (!error && isMounted && data) {
        setMessages(data);
      }
    };

    fetchMessages();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [senderId, receiverId]);

  // Subscribe to new messages in real time
  useEffect(() => {
    const channel = supabase
      .channel('realtime:messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId}))`
        },
        (payload: any) => {
          setMessages((msgs) => [...msgs, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [senderId, receiverId]);

  // Send a new message
  const sendMessage = useCallback(async () => {
    const content = newMessage.trim();
    if (!content) return;

    setLoading(true);
    const { error } = await supabase.from('messages').insert([
      {
        sender_id: senderId,
        receiver_id: receiverId,
        content
      }
    ]);
    setLoading(false);

    if (!error) {
      setNewMessage('');
    }
  }, [newMessage, receiverId, senderId, supabase]);

  return {
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    loading
  };
}