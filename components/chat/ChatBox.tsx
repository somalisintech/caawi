'use client';

import * as React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useChat } from './useChat';

interface ChatBoxProps {
  senderId: string; // Current user (mentor or mentee)
  receiverId: string; // Person you're chatting with
}

export function ChatBox({ senderId, receiverId }: ChatBoxProps) {
  const { messages, newMessage, setNewMessage, sendMessage, loading } = useChat({ senderId, receiverId });

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Accordion type="single" collapsible className="w-full max-w-md fixed bottom-4 right-4 z-50">
      <AccordionItem value="chat">
        <AccordionTrigger className="bg-primary text-primary-foreground rounded-t px-4 py-2">
          💬 Chat
        </AccordionTrigger>
        <AccordionContent className="bg-background border-b border-x border-muted rounded-b-lg shadow-lg min-h-[350px] flex flex-col">
          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
            {messages.length === 0 && (
              <div className="text-muted-foreground text-sm text-center mt-6">No messages yet.</div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_id === senderId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-xs text-sm ${
                    msg.sender_id === senderId
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {msg.content}
                  <div className="text-xs mt-1 opacity-60 text-right">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-2 border-t flex gap-2"
          >
            <Input
              placeholder="Type your message…"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button type="submit" disabled={loading || !newMessage.trim()}>
              Send
            </Button>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}