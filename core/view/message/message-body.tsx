"use client";

import { useGetAllChats, useGetMyChat } from "@/core/hooks/use-chat";
import ChateBody from "@/core/view/message/chate-body";

import { Loader2 } from "lucide-react";

type Props = {
  userId: string;
  type: string;
};

const MessageBody = ({ userId, type }: Props) => {
  const { data: allChats, isPending: allChatsLoading } = useGetAllChats();
  const { data: myChats, isPending: myChatsLoading } = useGetMyChat(userId);

  const chats = type === "employe" ? myChats : allChats;
  const chatLoading = type === "employe" ? myChatsLoading : allChatsLoading;

 

  if (!chats || chatLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <span className="ml-2 text-gray-600">
          Chargement des conversations...
        </span>
      </div>
    );
  }

  return <ChateBody userId={userId} chats={chats} color="slate" />;
};

export default MessageBody;
