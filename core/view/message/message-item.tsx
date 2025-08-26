"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { formatMentions, formatTimeMessage } from "@/core/lib/utils";
import type { MessageDetail, ParticipantDetail } from "@/core/lib/types";

interface MessageItemProps {
  message: MessageDetail;
  isCurrentUser: boolean;
  showAvatar: boolean;
  searchTerm: string;
  participants?: ParticipantDetail[];
}

export default function MessageItem({
  message,
  isCurrentUser,
  showAvatar,
  searchTerm,
  participants = [],
}: MessageItemProps) {
  const highlightText = (text: string, term: string) => {
    if (!term) return text;

    const regex = new RegExp(`(${term})`, "gi");
    return text.replace(
      regex,
      '<mark class="bg-yellow-200 text-gray-900 px-1 rounded">$1</mark>'
    );
  };

  const processMessageContent = (content: string) => {
    let processedContent = content;

    // 1. D'abord, formater les mentions
    const userNames = participants.map((p) => p.user.name);
    processedContent = formatMentions(processedContent, userNames);

    // 2. Ensuite, appliquer la surbrillance de recherche si nécessaire
    if (
      searchTerm &&
      content.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      processedContent = highlightText(processedContent, searchTerm);
    }

    return processedContent;
  };

  const shouldHighlight =
    searchTerm &&
    message.content.toLowerCase().includes(searchTerm.toLowerCase());
  const processedContent = processMessageContent(message.content);

  return (
    <div
      className={`flex gap-4 ${
        isCurrentUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {!isCurrentUser && (
        <Avatar
          className={`w-10 h-10 flex-shrink-0 ${
            showAvatar ? "opacity-100" : "opacity-0"
          }`}
        >
          <AvatarImage
            src={message.sender.profile}
          />
          <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-sm font-bold">
            {message.sender.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`max-w-lg ${
          isCurrentUser ? "items-end" : "items-start"
        } flex flex-col`}
      >
        {!isCurrentUser && showAvatar && (
          <div className="text-sm font-semibold text-gray-700 mb-2 px-1">
            {message.sender.name}
          </div>
        )}

        <div
          className={`px-3 py-2 rounded-lg ${
            isCurrentUser
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
              : "bg-emerald-50 border border-emerald-100 text-gray-800"
          } ${
            shouldHighlight ? "ring-2 ring-emerald-300 ring-opacity-50" : ""
          }`}
        >
          <div className="text-sm leading-relaxed message-content">
            <span
              dangerouslySetInnerHTML={{
                __html: processedContent,
              }}
            />
          </div>
        </div>

        <div
          className={`text-xs text-gray-400 mt-1 px-1 ${
            isCurrentUser ? "text-right" : "text-left"
          }`}
        >
          <p className="text-[10px]">{formatTimeMessage(message.sentAt)}</p>
        </div>
      </div>
    </div>
  );
}
