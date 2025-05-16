import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useRealtimeMessages(conversationId: string, onNewMessage: (message: unknown) => void) {
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message',
          filter: `conversationId=eq.${conversationId}`
        },
        (payload) => {
          onNewMessage(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, onNewMessage]);
}
