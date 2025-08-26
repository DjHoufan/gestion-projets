"use client";
import { JSX } from "react";
import { useGetMyChat } from "@/core/hooks/use-chat";
import { ViewProps } from "@/core/lib/types";
import { Loader2 } from "lucide-react";
import ChateBody from "@/core/view/message/chate-body";

export const Messages = ({ user }: ViewProps): JSX.Element => {
  const { data: chats, isPending: chatLoading } = useGetMyChat(user.id);
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
  return <ChateBody userId={user.id} chats={chats} color="emerald" />;
};
