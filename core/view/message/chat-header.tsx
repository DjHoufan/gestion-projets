"use client";

import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/core/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Search, UserIcon, ChevronDown, Plus } from "lucide-react";

import { AddParticipants } from "@/core/view/message/add-participants";

import type { ChatHeaderProps } from "@/core/lib/types";
import { useModal } from "@/core/providers/modal-provider";
import CustomModal from "@/core/components/wrappeds/custom-modal";
import { Spinner } from "@/core/components/ui/spinner";
import ParticipantsList from "@/core/view/message/participants-list";
import { useChat } from "@/core/hooks/store";

export default function ChatHeader({
  chats,
  selectedChat,
  selectedChatId,
  onChatSelect,
  messageSearchTerm,
  onSearchChange,
  onRemoveParticipant,
}: ChatHeaderProps) {
  const { open } = useModal();

  const { setChat } = useChat();

  const handleAddParticipant = () => {
    if (!selectedChat) return;

    open(
      <CustomModal size="md:max-w-[600px]">
        <AddParticipants Id={selectedChat.id} />
      </CustomModal>
    );
  };

  return (
    <div className="bg-white flex gap-5 flex-row-reverse pr-5 flex-shrink-0 sticky top-0 z-20 border-b border-gray-200">
      {/* Team Button */}
      <div className="flex items-center gap-4">
        {selectedChat && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-md border-emerald-200 hover:bg-emerald-50 bg-transparent"
              >
                <UserIcon className="w-4 h-4 mr-2" />
                Équipe ({selectedChat.participants.length})
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader className="flex-row justify-between items-center gap-5 p-2">
                <div>
                  <DialogTitle>Équipe du projet</DialogTitle>
                  <p className="text-sm text-gray-500">
                    {selectedChat.participants.length} membres actifs
                  </p>
                </div>
                <Button onClick={handleAddParticipant}>
                  <Plus className="w-4 h-4 mr-2" />
                  Participant
                </Button>
              </DialogHeader>
              <ParticipantsList
                participants={selectedChat.participants}
                onRemoveParticipant={onRemoveParticipant}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Chat Selector */}
      <div className="flex items-center gap-4">
        <Select
          value={selectedChatId || ""}
          onValueChange={(val) => {
            setChat(val);
            onChatSelect(val);
          }}
        >
          <SelectTrigger className="w-80 bg-white/60 border-emerald-200/50 hover:bg-white/80 transition-all">
            <SelectValue placeholder="Sélectionner un projet" />
          </SelectTrigger>
          <SelectContent>
            {chats ? (
              chats.map((chat) => (
                <SelectItem key={chat.id} value={chat.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        chat.project.status ? "bg-emerald-400" : "bg-gray-300"
                      }`}
                    />
                    <span className="text-sm font-medium">
                      {chat.project.name}
                    </span>
                  </div>
                </SelectItem>
              ))
            ) : (
              <div className="w-full h-12 flex justify-center items-center">
                <Spinner variant="bars" className="text-primary" />
              </div>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Search Bar */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-emerald-100/50 p-4 w-full">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher dans les messages..."
              value={messageSearchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-white/80 border-emerald-200/50 rounded-md h-10 focus:bg-white transition-all"
            />
          </div>
          {messageSearchTerm && (
            <p className="text-xs text-gray-500 mt-2">
              Recherche active pour "{messageSearchTerm}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
