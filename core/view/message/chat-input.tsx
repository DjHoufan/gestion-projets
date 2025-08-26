"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { Textarea } from "@/core/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { useMessages } from "@/core/hooks/use-messages";

interface ChatInputProps {
  chatId: string | null;
  currentUserId: string;
  color: string;
}

export default function ChatInput({
  chatId,
  currentUserId,
  color,
}: ChatInputProps) {
  const [newMessage, setNewMessage] = useState("");
  const { sendMessage, isSendingMessage } = useMessages(chatId);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !chatId) return;

    sendMessage({ content: newMessage, senderId: currentUserId });
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={`bg-gradient-to-l from-${color}-900 via-${color}-800 to-${color}-900 border-t border-emerald-100/50 p-6 flex-shrink-0 sticky bottom-0 z-10`}
    >
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <div className="flex-1 relative">
          <Textarea
            placeholder="Écrivez votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pr-4 py-4 rounded-md border-gray-200/50 bg-white transition-all h-14 text-sm resize-none"
            disabled={isSendingMessage}
            rows={1}
          />
        </div>
        <Button
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || isSendingMessage}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-md px-8 py-4 h-14 disabled:opacity-50 transition-all"
          aria-label="Envoyer le message"
        >
          {isSendingMessage ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
