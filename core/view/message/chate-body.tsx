"use client";

import { useState, useMemo, useEffect } from "react";

import { Loader2 } from "lucide-react";

import type {
  ChatDetail,
  IdType,
  MessageDetail,
  ParticipantDetail,
  UserDetail,
} from "@/core/lib/types";

import { useGetAllChats, useRemoveParticipants } from "@/core/hooks/use-chat";
import { DeleteConfirmation } from "@/core/components/global/delete-confirmation";
import ChatHeader from "@/core/view/message/chat-header";
import ChatMessages from "@/core/view/message/chat-messages";
import ChatInput from "@/core/view/message/chat-input";
import EmptyState from "@/core/view/message/empty-state";
import { useQueryClient } from "@tanstack/react-query";
import { Message } from "@prisma/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabaseClientBrowser } from "@/core/supabase/client";
import { useChat } from "@/core/hooks/store";

type Props = {
  chats: ChatDetail[];
  userId: string;
  color: string;
};

export default function ChateBody({ chats, userId, color }: Props) {
  const queryClient = useQueryClient();

  const { mutate: removeParticipant, isPending: loading } =
    useRemoveParticipants();
  const { setChat } = useChat();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageSearchTerm, setMessageSearchTerm] = useState("");
  const [participant, setParticipant] = useState<ParticipantDetail | null>(
    null
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  // Update selectedChatId when chats load
  useEffect(() => {
    if (chats && chats.length > 0 && !selectedChatId) {
      setSelectedChatId(chats[0].id);

      setChat(chats[0].id);
    }
  }, [chats, selectedChatId]);

  const selectedChat = useMemo(() => {
    return chats?.find((chat) => chat.id === selectedChatId);
  }, [chats, selectedChatId]);

  const handleDeleteParticipant = async () => {
    if (!participant) return;

    removeParticipant(
      { param: { pId: participant.id } },
      {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setParticipant(null);
        },
      }
    );
  };

  const handleRemoveParticipant = (participantToRemove: ParticipantDetail) => {
    setParticipant(participantToRemove);
    setIsDeleteOpen(true);
  };

  const handleNewMessage = (message: Message, user: UserDetail) => {
    const newMessage = {
      ...message,
      sentAt: new Date(Date.now()),
      sender: user,
    };

    queryClient.setQueryData(["messages", message.chatId], (oldData: any) => {
      if (!oldData) return oldData;

      const newPages = [...oldData.pages];
      const lastPageIndex = newPages.length - 1;

      if (lastPageIndex >= 0) {
        // Récupère la dernière page existante
        const lastPage = newPages[lastPageIndex];

        // Vérifie si le message n'existe pas déjà (évite les doublons)
        const messageExists = lastPage.messages.some(
          (msg: MessageDetail) => msg.id === newMessage.id
        );
        if (messageExists) return oldData;

        // Crée une nouvelle version de la dernière page avec le message ajouté à la fin
        const updatedLastPage = {
          ...lastPage,
          messages: [...lastPage.messages, newMessage], // Ajoute à la fin
        };

        // Remplace la dernière page par la version mise à jour
        newPages[lastPageIndex] = updatedLastPage;
      }

      // Retourne les données mises à jour
      return {
        ...oldData,
        pages: newPages,
      };
    });
  };


  useEffect(() => {
  const fetchProfile = async (senderId: string) => {
    const res = await fetch(`/api/team/profile/${senderId}`);
    const { data } = await res.json();
    return data;
  };

  const channel = supabaseClientBrowser
    .channel("messages")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "Message" },
      async (payload) => {
        const newMessage = payload.new as Message;

        if (newMessage.senderId !== userId) {
          const profile = await fetchProfile(newMessage.senderId);
          if (profile) handleNewMessage(newMessage, profile);
        }
      }
    )
    .subscribe();

  return () => {
    supabaseClientBrowser.removeChannel(channel);
  };
}, [userId, handleNewMessage]);


  return (
    <>
      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteParticipant}
        loading={loading}
        title={`${participant?.user.name} de la conversation`}
      />

      <div className="flex flex-col" style={{ height: "calc(100vh - 60px)" }}>
        <ChatHeader
          chats={chats ? chats : []}
          selectedChat={selectedChat}
          selectedChatId={selectedChatId}
          onChatSelect={setSelectedChatId}
          messageSearchTerm={messageSearchTerm}
          onSearchChange={setMessageSearchTerm}
          onRemoveParticipant={handleRemoveParticipant}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedChat && userId ? (
            <>
              <ChatMessages
                chatId={selectedChatId}
                currentUserId={userId}
                searchTerm={messageSearchTerm}
                participants={selectedChat.participants}
              />
              <ChatInput
                chatId={selectedChatId}
                currentUserId={userId}
                color={color}
              />
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </>
  );
}
