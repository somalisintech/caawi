'use client';

import * as React from 'react';
import { useState, useCallback, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendIcon, ArrowDown, MessageSquare, Search, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/utils/supabase/client';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Types
interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participants: {
    id: string; // participantId
    user: {
      id: string;
      firstName?: string;
      lastName?: string;
      email: string;
      image?: string | null;
      profile?: { bio?: string | null };
    };
  }[];
  messages: {
    content: string;
    createdAt: string;
  }[];
  updatedAt: string;
}

interface ScrollState {
  isAtBottom: boolean;
  autoScrollEnabled: boolean;
}

interface UseAutoScrollOptions {
  offset?: number;
  smooth?: boolean;
  content?: React.ReactNode;
}

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  smooth?: boolean;
}

interface ChatBubbleProps {
  variant?: 'sent' | 'received';
  className?: string;
  children: React.ReactNode;
}

interface ChatBubbleMessageProps {
  variant?: 'sent' | 'received';
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
  timestamp?: string;
}

interface ChatBubbleAvatarProps {
  src?: string;
  fallback?: string;
  className?: string;
}

interface MentorMenteeChatProps {
  conversationId?: string;
  currentUserId?: string;
  showSidebar?: boolean;
}

function MessageLoading() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="text-foreground">
      <circle cx="4" cy="12" r="2" fill="currentColor">
        <animate
          id="spinner_qFRN"
          begin="0;spinner_OcgL.end+0.25s"
          attributeName="cy"
          calcMode="spline"
          dur="0.6s"
          values="12;6;12"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
        />
      </circle>
      <circle cx="12" cy="12" r="2" fill="currentColor">
        <animate
          begin="spinner_qFRN.begin+0.1s"
          attributeName="cy"
          calcMode="spline"
          dur="0.6s"
          values="12;6;12"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
        />
      </circle>
      <circle cx="20" cy="12" r="2" fill="currentColor">
        <animate
          id="spinner_OcgL"
          begin="spinner_qFRN.begin+0.2s"
          attributeName="cy"
          calcMode="spline"
          dur="0.6s"
          values="12;6;12"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
        />
      </circle>
    </svg>
  );
}

function useAutoScroll(options: UseAutoScrollOptions = {}) {
  const { offset = 20, smooth = false, content } = options;
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastContentHeight = useRef(0);
  const userHasScrolled = useRef(false);

  const [scrollState, setScrollState] = useState<ScrollState>({
    isAtBottom: true,
    autoScrollEnabled: true
  });

  const checkIsAtBottom = useCallback(
    (element: HTMLElement) => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const distanceToBottom = Math.abs(scrollHeight - scrollTop - clientHeight);
      return distanceToBottom <= offset;
    },
    [offset]
  );

  const scrollToBottom = useCallback(
    (instant?: boolean) => {
      if (!scrollRef.current) return;
      const targetScrollTop = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
      if (instant) {
        scrollRef.current.scrollTop = targetScrollTop;
      } else {
        scrollRef.current.scrollTo({ top: targetScrollTop, behavior: smooth ? 'smooth' : 'auto' });
      }
      setScrollState({ isAtBottom: true, autoScrollEnabled: true });
      userHasScrolled.current = false;
    },
    [smooth]
  );

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const atBottom = checkIsAtBottom(scrollRef.current);
    setScrollState((prev) => ({ isAtBottom: atBottom, autoScrollEnabled: atBottom ? true : prev.autoScrollEnabled }));
  }, [checkIsAtBottom]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    element.addEventListener('scroll', handleScroll, { passive: true });
    return () => element.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;
    const currentHeight = scrollElement.scrollHeight;
    const hasNewContent = currentHeight !== lastContentHeight.current;
    if (hasNewContent) {
      if (scrollState.autoScrollEnabled) {
        requestAnimationFrame(() => {
          scrollToBottom(lastContentHeight.current === 0);
        });
      }
      lastContentHeight.current = currentHeight;
    }
  }, [content, scrollState.autoScrollEnabled, scrollToBottom]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const resizeObserver = new ResizeObserver(() => {
      if (scrollState.autoScrollEnabled) {
        scrollToBottom(true);
      }
    });
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, [scrollState.autoScrollEnabled, scrollToBottom]);

  const disableAutoScroll = useCallback(() => {
    const atBottom = scrollRef.current ? checkIsAtBottom(scrollRef.current) : false;
    if (!atBottom) {
      userHasScrolled.current = true;
      setScrollState((prev) => ({ ...prev, autoScrollEnabled: false }));
    }
  }, [checkIsAtBottom]);

  return {
    scrollRef,
    isAtBottom: scrollState.isAtBottom,
    scrollToBottom: () => scrollToBottom(false),
    disableAutoScroll
  };
}

function ChatInput({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Textarea
      autoComplete="off"
      name="message"
      className={cn(
        'max-h-24 px-4 py-3 bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md flex items-center resize-none',
        className
      )}
      {...props}
    />
  );
}

function ChatBubble({ variant = 'received', className, children }: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex items-start gap-3 mb-4',
        variant === 'sent' ? 'flex-row-reverse justify-end' : 'justify-start',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

function ChatBubbleMessage({
  variant = 'received',
  isLoading,
  className,
  children,
  timestamp
}: ChatBubbleMessageProps) {
  return (
    <div className="flex flex-col">
      <div
        className={cn(
          'rounded-lg p-3 max-w-[85%]',
          variant === 'sent'
            ? 'bg-primary text-primary-foreground rounded-tr-none'
            : 'bg-muted text-foreground rounded-tl-none',
          className
        )}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <MessageLoading />
          </div>
        ) : (
          children
        )}
      </div>
      {timestamp && (
        <span className="mt-1 px-1 text-xs text-muted-foreground">
          {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  );
}

function ChatBubbleAvatar({ src, fallback = 'AI', className }: ChatBubbleAvatarProps) {
  return (
    <Avatar className={cn('h-8 w-8', className)}>
      {src && <AvatarImage src={src} />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ className, children, smooth = false, ...props } /* _ref */) => {
    const { scrollRef, isAtBottom, scrollToBottom, disableAutoScroll } = useAutoScroll({
      smooth,
      content: children
    });
    return (
      <div className="relative size-full">
        <div
          className={cn('flex flex-col w-full h-full p-4 overflow-y-auto', className)}
          ref={scrollRef}
          onWheel={disableAutoScroll}
          onTouchMove={disableAutoScroll}
          {...props}
        >
          <div className="flex flex-col gap-6">{children}</div>
        </div>
        {!isAtBottom && (
          <Button
            onClick={() => {
              scrollToBottom();
            }}
            size="icon"
            variant="outline"
            className="absolute bottom-2 left-1/2 inline-flex -translate-x-1/2 rounded-full shadow-md"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="size-4" />
          </Button>
        )}
      </div>
    );
  }
);
ChatMessageList.displayName = 'ChatMessageList';

function getOtherParticipant(conversation: Conversation, currentUserId: string) {
  return conversation.participants.find((p) => p.user.id !== currentUserId)?.user;
}

function getSenderUser(conversation: Conversation, senderId: string) {
  // senderId is participantId
  return conversation.participants.find((p) => p.id === senderId)?.user;
}

function getUserBio(
  user:
    | {
        profile?: { bio?: string | null };
      }
    | undefined
    | null
): string | null {
  if (!user) return null;
  if (user.profile && typeof user.profile.bio === 'string' && user.profile.bio.trim()) return user.profile.bio;
  return null;
}

function MentorMenteeChat({ conversationId, currentUserId: propUserId, showSidebar = true }: MentorMenteeChatProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(conversationId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(showSidebar);
  const [currentUserId, setCurrentUserId] = useState<string | null>(propUserId || null);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [conversationsError, setConversationsError] = useState<string | null>(null);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [showBio, setShowBio] = useState(false);

  // Get current user id if not provided
  useEffect(() => {
    if (propUserId) return;
    const getUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data.user?.id || null);
    };
    getUser();
  }, [propUserId]);

  // Fetch conversations (unless in single-conversation mode)
  useEffect(() => {
    if (!currentUserId || conversationId) return;
    setLoadingConversations(true);
    setConversationsError(null);
    fetch('/api/chat/conversation')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch conversations');
        return res.json();
      })
      .then((data) => {
        setConversations(data);
        if (data.length > 0 && !activeConversationId) {
          setActiveConversationId(data[0].id);
        }
      })
      .catch((err) => setConversationsError(err.message))
      .finally(() => setLoadingConversations(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, conversationId]);

  // Fetch messages for active conversation
  useEffect(() => {
    const id = conversationId || activeConversationId;
    if (!id) return;
    setLoadingMessages(true);
    setMessagesError(null);
    fetch(`/api/chat/conversation/${id}/messages`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch messages');
        return res.json();
      })
      .then((data) => setMessages(data))
      .catch((err) => setMessagesError(err.message))
      .finally(() => setLoadingMessages(false));
  }, [conversationId, activeConversationId]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setSidebarOpen(window.innerWidth >= 768 && showSidebar);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [showSidebar]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !(conversationId || activeConversationId)) return;
    setIsLoading(true);
    setSendError(null);
    try {
      const res = await fetch(`/api/chat/conversation/${conversationId || activeConversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input })
      });
      if (!res.ok) throw new Error('Failed to send message');
      const newMessage = await res.json();
      setMessages((prev) => [...prev, newMessage]);
      setInput('');
    } catch (err: unknown) {
      let msg = 'Failed to send message';
      if (err instanceof Error) msg = err.message;
      setSendError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conversation) => {
    const other = getOtherParticipant(conversation, currentUserId || '');
    return (
      other?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      other?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      other?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const currentConversation = conversationId
    ? conversations.find((c) => c.id === conversationId) || {
        id: conversationId,
        participants: [],
        messages: [],
        updatedAt: ''
      }
    : conversations.find((c) => c.id === activeConversationId);
  const otherUser =
    currentConversation && currentUserId ? getOtherParticipant(currentConversation, currentUserId) : null;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      {/* Sidebar (hide if single-conversation mode) */}
      <AnimatePresence>
        {showSidebar && !conversationId && sidebarOpen && (
          <motion.div
            className="flex w-full flex-col border-r border-border md:w-80"
            initial={{ x: isMobile ? -320 : 0, opacity: isMobile ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border-b border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Messages</h2>
                {isMobile && (
                  <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                    <ArrowDown className="size-4 rotate-90" />
                  </Button>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loadingConversations ? (
                <div className="p-4 text-center text-gray-400">Loading...</div>
              ) : conversationsError ? (
                <div className="p-4 text-center text-red-400">{conversationsError}</div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-gray-400">No conversations yet.</div>
              ) : (
                filteredConversations.map((conversation) => {
                  const other = getOtherParticipant(conversation, currentUserId || '');
                  if (!other) return null;
                  return (
                    <motion.div
                      key={conversation.id}
                      whileHover={{ backgroundColor: 'hsl(var(--muted))' }}
                      className={cn(
                        'flex items-center gap-3 p-3 cursor-pointer border-b border-border',
                        activeConversationId === conversation.id && 'bg-muted'
                      )}
                      onClick={() => {
                        setActiveConversationId(conversation.id);
                        if (isMobile) setSidebarOpen(false);
                      }}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={other.image || undefined} />
                          <AvatarFallback>{other.firstName?.charAt(0) || other.email.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="truncate font-medium">{other.firstName || other.email}</h3>
                          <span className="text-xs text-muted-foreground">
                            {conversation.messages[0]?.createdAt
                              ? new Date(conversation.messages[0].createdAt).toLocaleDateString()
                              : ''}
                          </span>
                        </div>
                        <p className="truncate text-sm text-muted-foreground">
                          {conversation.messages[0]?.content || 'No messages yet'}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Main Chat Area */}
      <div className="flex h-full flex-1 flex-col">
        {/* Error banners */}
        {conversationsError && (
          <div className="flex items-center justify-between bg-red-100 px-4 py-2 text-sm text-red-700">
            <span>{conversationsError}</span>
            <button onClick={() => setConversationsError(null)} className="ml-2">
              ✕
            </button>
          </div>
        )}
        {messagesError && (
          <div className="flex items-center justify-between bg-red-100 px-4 py-2 text-sm text-red-700">
            <span>{messagesError}</span>
            <button onClick={() => setMessagesError(null)} className="ml-2">
              ✕
            </button>
          </div>
        )}
        {sendError && (
          <div className="flex items-center justify-between bg-red-100 px-4 py-2 text-sm text-red-700">
            <span>{sendError}</span>
            <button onClick={() => setSendError(null)} className="ml-2">
              ✕
            </button>
          </div>
        )}
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-3">
            {isMobile && !sidebarOpen && (
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <MessageSquare className="size-5" />
              </Button>
            )}
            {otherUser && (
              <>
                <Avatar>
                  <AvatarImage src={otherUser.image || undefined} />
                  <AvatarFallback>{otherUser.firstName?.charAt(0) || otherUser.email.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{otherUser.firstName || otherUser.email}</h3>
                  <p className="text-xs text-muted-foreground">&nbsp;</p>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Popover open={showBio} onOpenChange={setShowBio}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Show user bio">
                  <Info className="size-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="max-w-xs">
                <div className="mb-1 font-semibold">Bio</div>
                <div className="text-sm text-muted-foreground">{getUserBio(otherUser) || 'No bio available.'}</div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <ChatMessageList smooth>
            {loadingMessages ? (
              <div className="text-center text-gray-400">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-400">No messages yet.</div>
            ) : (
              messages.map((message) => {
                const isCurrentUser = message.senderId === currentUserId;
                const senderUser = currentConversation ? getSenderUser(currentConversation, message.senderId) : null;
                return (
                  <ChatBubble key={message.id} variant={isCurrentUser ? 'sent' : 'received'}>
                    <ChatBubbleAvatar
                      className="size-8 shrink-0"
                      src={senderUser?.image || undefined}
                      fallback={senderUser?.firstName?.charAt(0) || senderUser?.email?.charAt(0) || 'U'}
                    />
                    <ChatBubbleMessage variant={isCurrentUser ? 'sent' : 'received'} timestamp={message.createdAt}>
                      {message.content}
                    </ChatBubbleMessage>
                  </ChatBubble>
                );
              })
            )}
          </ChatMessageList>
        </div>
        {/* Message Input */}
        <div className="border-t border-border p-4">
          <form
            onSubmit={handleSubmit}
            className="relative rounded-lg border bg-background p-1 focus-within:ring-1 focus-within:ring-ring"
          >
            <ChatInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="min-h-12 resize-none rounded-lg border-0 bg-background p-3 shadow-none focus-visible:ring-0"
              disabled={isLoading}
            />
            <div className="flex items-center justify-end p-3 pt-0">
              <Button type="submit" size="sm" className="ml-auto gap-1.5" disabled={isLoading || !input.trim()}>
                Send Message
                <SendIcon className="size-3.5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Default export: wrapper that provides currentUserId if not passed
export default function MentorMenteeChatPage(props: Omit<MentorMenteeChatProps, 'currentUserId'>) {
  return <MentorMenteeChat {...props} />;
}
// Also export the component for direct use
export { MentorMenteeChat };
