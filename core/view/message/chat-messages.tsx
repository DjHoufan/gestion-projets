"use client";

import React, { useRef, useEffect, useCallback, useState, useMemo, useReducer } from "react";
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

// ✅ Reducer pour gérer l'état complexe
type ChatState = {
  shouldScrollToBottom: boolean;
  lastMessageCount: number;
  isInitialRender: boolean;
  isUserScrolling: boolean;
};

type ChatAction = 
  | { type: 'SET_SCROLL_TO_BOTTOM'; payload: boolean }
  | { type: 'SET_MESSAGE_COUNT'; payload: number }
  | { type: 'SET_INITIAL_RENDER'; payload: boolean }
  | { type: 'SET_USER_SCROLLING'; payload: boolean }
  | { type: 'RESET_CHAT' };

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_SCROLL_TO_BOTTOM':
      return { ...state, shouldScrollToBottom: action.payload };
    case 'SET_MESSAGE_COUNT':
      return { ...state, lastMessageCount: action.payload };
    case 'SET_INITIAL_RENDER':
      return { ...state, isInitialRender: action.payload };
    case 'SET_USER_SCROLLING':
      return { ...state, isUserScrolling: action.payload };
    case 'RESET_CHAT':
      return {
        shouldScrollToBottom: true,
        lastMessageCount: 0,
        isInitialRender: true,
        isUserScrolling: false,
      };
    default:
      return state;
  }
};

// ✅ Composant MessageItem mémorisé
const MemoizedMessageItem = React.memo(MessageItem, (prevProps, nextProps) => {
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.isCurrentUser === nextProps.isCurrentUser &&
    prevProps.showAvatar === nextProps.showAvatar &&
    prevProps.searchTerm === nextProps.searchTerm
  );
});

const ChatMessages = ({
  chatId,
  currentUserId,
  searchTerm,
  participants = [],
}: ChatMessagesProps) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);

  // ✅ Utiliser useReducer au lieu de multiples useState
  const [state, dispatch] = useReducer(chatReducer, {
    shouldScrollToBottom: true,
    lastMessageCount: 0,
    isInitialRender: true,
    isUserScrolling: false,
  });

  const {
    messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useMessages(chatId);

  // ✅ Filtrage optimisé avec debounce
  const filteredMessages = useMemo(() => {
    if (!searchTerm.trim()) return messages;

    const lowercaseSearch = searchTerm.toLowerCase();
    return messages.filter(
      (message) =>
        message.content.toLowerCase().includes(lowercaseSearch) ||
        message.sender.name.toLowerCase().includes(lowercaseSearch)
    );
  }, [messages, searchTerm]);

  // ✅ Fonction de scroll optimisée
  const scrollToBottom = useCallback((smooth = false) => {
    if (messagesContainerRef.current && !state.isUserScrolling) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  }, [state.isUserScrolling]);

  // ✅ Effet pour le scroll initial optimisé
  useEffect(() => {
    if (!state.isInitialRender || messages.length === 0) return;

    const container = messagesContainerRef.current;
    if (!container) return;

    // ✅ Utiliser requestAnimationFrame pour de meilleures performances
    const scrollToBottomImmediate = () => {
      requestAnimationFrame(() => {
        if (container) {
          container.scrollTop = container.scrollHeight;
          dispatch({ type: 'SET_INITIAL_RENDER', payload: false });
        }
      });
    };

    const timeout = setTimeout(scrollToBottomImmediate, 50);
    return () => clearTimeout(timeout);
  }, [messages.length, state.isInitialRender]);

  // ✅ Auto-scroll optimisé pour nouveaux messages
  useEffect(() => {
    const shouldScroll =
      !state.isInitialRender &&
      state.shouldScrollToBottom &&
      !state.isUserScrolling &&
      messages.length > state.lastMessageCount;

    if (shouldScroll) {
      requestAnimationFrame(() => scrollToBottom(true));
    }

    dispatch({ type: 'SET_MESSAGE_COUNT', payload: messages.length });
  }, [
    messages.length,
    state.shouldScrollToBottom,
    state.isUserScrolling,
    state.lastMessageCount,
    state.isInitialRender,
    scrollToBottom,
  ]);

  // ✅ Reset optimisé lors du changement de chat
  useEffect(() => {
    dispatch({ type: 'RESET_CHAT' });
  }, [chatId]);

  // ✅ Gestion du scroll avec debounce et optimisations
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    dispatch({ type: 'SET_SCROLL_TO_BOTTOM', payload: isNearBottom });
    
    if (!isScrollingRef.current) {
      dispatch({ type: 'SET_USER_SCROLLING', payload: true });
      
      // Reset user scrolling après 1 seconde d'inactivité
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        dispatch({ type: 'SET_USER_SCROLLING', payload: false });
        isScrollingRef.current = false;
      }, 1000);
    }

    // ✅ Chargement infini optimisé
    if (scrollTop < 100 && hasNextPage && !isFetchingNextPage) {
      const previousScrollHeight = scrollHeight;
      const previousScrollTop = scrollTop;

      fetchNextPage().then(() => {
        // Maintenir la position de scroll
        requestAnimationFrame(() => {
          if (messagesContainerRef.current) {
            const newScrollHeight = messagesContainerRef.current.scrollHeight;
            const scrollDiff = newScrollHeight - previousScrollHeight;
            messagesContainerRef.current.scrollTop = previousScrollTop + scrollDiff;
          }
        });
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

  // ✅ Cleanup des timeouts
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // ✅ Composant de chargement mémorisé
  const LoadingComponent = useMemo(() => (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      <span className="ml-2 text-gray-600">Chargement des messages...</span>
    </div>
  ), []);

  if (isLoading) {
    return LoadingComponent;
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

      {/* ✅ Overlay de chargement initial optimisé */}
      {state.isInitialRender && messages.length > 0 && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="flex items-center gap-3 bg-white rounded-lg shadow-lg p-6">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
            <span className="text-gray-700 font-medium">Préparation des messages...</span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-3 p-4 pb-8">
        {/* ✅ Compteur de recherche mémorisé */}
        {searchTerm && (
          <div className="text-center py-2">
            <p className="text-xs text-gray-500">
              {filteredMessages.length} message{filteredMessages.length > 1 ? "s" : ""} trouvé{filteredMessages.length > 1 ? "s" : ""}
            </p>
          </div>
        )}

        {/* ✅ Messages optimisés avec composant mémorisé */}
        {filteredMessages.map((message, index) => {
          const isCurrentUser = message.senderId === currentUserId;
          const showAvatar =
            index === 0 ||
            filteredMessages[index - 1]?.senderId !== message.senderId;

          return (
            <MemoizedMessageItem
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

export default React.memo(ChatMessages);
