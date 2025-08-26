"use client";

import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { useMessages } from "@/core/hooks/use-messages";
import { Loader2 } from "lucide-react";
import MessageItem from "@/core/view/message/message-item";
import { ParticipantDetail } from "@/core/lib/types";

interface ChatMessagesProps {
  chatId: string | null;
  currentUserId: string;
  searchTerm: string;
  participants?: ParticipantDetail[];
}

const ChatMessages = ({
  chatId,
  currentUserId,
  searchTerm,
  participants = [],
}: ChatMessagesProps) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const [isInitialRender, setIsInitialRender] = useState(true);

  const {
    messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useMessages(chatId);

  const filteredMessages = useMemo(() => {
    if (!searchTerm) return messages;

    return messages.filter(
      (message) =>
        message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.sender.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [messages, searchTerm]);

  const scrollToBottom = useCallback((smooth = false) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  }, []);

  // Initial scroll to bottom
  useEffect(() => {
    if (!isInitialRender || messages.length === 0) return;

    const container = messagesContainerRef.current;
    if (!container) return;

    const scrollToBottomImmediate = () => {
      container.scrollTop = container.scrollHeight;
      setIsInitialRender(false);
    };

    const timeout = setTimeout(scrollToBottomImmediate, 100);
    return () => clearTimeout(timeout);
  }, [messages.length, isInitialRender]);

  // Auto-scroll for new messages (only if user is at bottom)
  useEffect(() => {
    const shouldScroll =
      !isInitialRender &&
      shouldScrollToBottom &&
      messages.length > lastMessageCount;

    if (shouldScroll) {
      const timeout = setTimeout(() => scrollToBottom(true), 100);
      return () => clearTimeout(timeout);
    }

    setLastMessageCount(messages.length);
  }, [
    messages.length,
    shouldScrollToBottom,
    scrollToBottom,
    lastMessageCount,
    isInitialRender,
  ]);

  // Reset on chat change
  useEffect(() => {
    setIsInitialRender(true);
    setShouldScrollToBottom(true);
    setLastMessageCount(0);
  }, [chatId]);

  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldScrollToBottom(isNearBottom);

    // Load more messages when scrolling up
    if (scrollTop < 100 && hasNextPage && !isFetchingNextPage) {
      const previousScrollHeight = scrollHeight;
      const previousScrollTop = scrollTop;

      fetchNextPage().then(() => {
        // Maintenir la position de scroll après le chargement
        setTimeout(() => {
          if (messagesContainerRef.current) {
            const newScrollHeight = messagesContainerRef.current.scrollHeight;
            const scrollDiff = newScrollHeight - previousScrollHeight;
            messagesContainerRef.current.scrollTop =
              previousScrollTop + scrollDiff;
          }
        }, 50);
      });
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <span className="ml-2 text-gray-600">Chargement des messages...</span>
      </div>
    );
  }

  return (
    <div ref={messagesContainerRef} className="flex-1 overflow-y-auto relative">
      {/* Loading indicator at top */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-4 sticky top-0 bg-white/90 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2 text-emerald-600 bg-white rounded-full px-4 py-2 shadow-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">
              Chargement des messages précédents...
            </span>
          </div>
        </div>
      )}

      {/* Initial loading overlay */}
      {isInitialRender && messages.length > 0 && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="flex items-center gap-3 bg-white rounded-lg shadow-lg p-6">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
            <span className="text-gray-700 font-medium">
              Préparation des messages...
            </span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-3 p-4 pb-8">
        {searchTerm && (
          <div className="text-center py-2">
            <p className="text-xs text-gray-500">
              {filteredMessages.length} message
              {filteredMessages.length > 1 ? "s" : ""} trouvé
              {filteredMessages.length > 1 ? "s" : ""}
            </p>
          </div>
        )}

        {filteredMessages.map((message, index) => {
          const isCurrentUser = message.senderId === currentUserId;
          const showAvatar =
            index === 0 ||
            filteredMessages[index - 1]?.senderId !== message.senderId;

          return (
            <MessageItem
              key={message.id}
              message={message}
              isCurrentUser={isCurrentUser}
              showAvatar={showAvatar}
              searchTerm={searchTerm}
              participants={participants}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ChatMessages;
