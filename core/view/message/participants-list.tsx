"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/core/components/ui/avatar"
import { Button } from "@/core/components/ui/button"
import { Trash2 } from "lucide-react"
import type { ParticipantDetail } from "@/core/lib/types"

interface ParticipantsListProps {
  participants: ParticipantDetail[]
  onRemoveParticipant: (participant: ParticipantDetail) => void
}

export default function ParticipantsList({ participants, onRemoveParticipant }: ParticipantsListProps) {
  return (
    <div className="space-y-4 mt-4">
      {participants.map((participant) => (
        <div
          key={participant.id}
          className="bg-gray-50 p-4 rounded-md hover:bg-gray-100 transition-all duration-200 group"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage src={participant.user.profile || "/placeholder.svg?height=48&width=48&query=user"} />
                <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-bold">
                  {participant.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm group-hover:text-emerald-700 transition-colors">
                {participant.user.name}
              </h4>
              <p className="text-xs text-gray-400 mt-1">En ligne</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveParticipant(participant)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Supprimer ${participant.user.name}`}
            >
              <Trash2 size={16} className="text-red-500" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
