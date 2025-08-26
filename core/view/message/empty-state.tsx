"use client"

import { MessageCircle } from "lucide-react"

export default function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <MessageCircle className="w-16 h-16 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Sélectionnez un projet</h3>
        <p className="text-gray-600 max-w-md">
          Choisissez un projet dans les onglets ci-dessus pour commencer à collaborer
        </p>
      </div>
    </div>
  )
}
