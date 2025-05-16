'use client';

import * as React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useChat } from './useChat';

interface ChatBoxProps {
  senderId: string;
  receiverId: string;
}

export function ChatBox({ senderId, receiverId }: ChatBoxProps) {
  const { messages, newMessage, setNewMessage, sendMessage, loading } = useChat({ senderId, receiverId });

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <Accordion type="single" collapsible className="fixed bottom-4 right-4 z-50 w-full max-w-md">
      <AccordionItem value="chat">
        <AccordionTrigger className="rounded-t bg-primary px-4 py-2 text-primary-foreground">
          <span role="img" aria-label="Chat">
            💬
          </span>{' '}
          Chat
        </AccordionTrigger>
        <AccordionContent className="flex min-h-[350px] flex-col rounded-b-lg border-x border-b border-muted bg-background shadow-lg">
          <div className="flex-1 space-y-2 overflow-y-auto p-2">
            {messages.length === 0 && (
              <div className="mt-6 text-center text-sm text-muted-foreground">No messages yet.</div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.senderId === senderId ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                    msg.senderId === senderId ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {msg.content}
                  <div className="mt-1 text-right text-xs opacity-60">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleFormSubmit} className="flex gap-2 border-t p-2">
            <Input
              placeholder="Type your message…"
              value={newMessage}
              onChange={handleInputChange}
              disabled={loading}
              onKeyDown={handleInputKeyDown}
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
