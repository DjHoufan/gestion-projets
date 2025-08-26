"use client"

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getMessages, type PaginatedMessages, sendMessage } from "@/core/hooks/use-chat"
import { useMemo } from "react"

export function useMessages(chatId: string | null) {
  const queryClient = useQueryClient()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteQuery<
    PaginatedMessages,
    Error
  >({
    queryKey: ["messages", chatId ?? null],
    queryFn: ({ pageParam = null }) => {
      if (!chatId) throw new Error("chatId is required")

      return getMessages({
        chatId,
        cursor: typeof pageParam === "string" ? pageParam : undefined,
        limit: 20,
      })
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
    enabled: !!chatId,
    refetchOnWindowFocus: false,
  })

  const sendMessageMutation = useMutation({
    mutationFn: ({
      content,
      senderId,
    }: {
      content: string
      senderId: string
    }) => sendMessage(chatId!, content, senderId),
    onSuccess: (newMessage) => {
      // Ajouter le nouveau message à la fin de la dernière page (messages les plus récents)
      queryClient.setQueryData(["messages", chatId], (oldData: any) => {
        if (!oldData) return oldData

        const newPages = [...oldData.pages]
        const lastPageIndex = newPages.length - 1

        if (lastPageIndex >= 0) {
          newPages[lastPageIndex] = {
            ...newPages[lastPageIndex],
            messages: [...newPages[lastPageIndex].messages, newMessage],
          }
        }

        return {
          ...oldData,
          pages: newPages,
        }
      })
    },
  })

  // Aplatir tous les messages de toutes les pages dans le bon ordre
  const messages = useMemo(() => {
    if (!data?.pages) return []

    // Les pages sont dans l'ordre : [plus anciens] -> [plus récents]
    // On inverse l'ordre des pages puis on les aplatit
    const allMessages = data.pages
      .slice()
      .reverse() // Inverser l'ordre des pages
      .flatMap((page) => page.messages)

    // Trier par date pour s'assurer de l'ordre chronologique
    return allMessages.sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime())
  }, [data?.pages])

  return {
    messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    sendMessage: sendMessageMutation.mutate,
    isSendingMessage: sendMessageMutation.isPending,
  }
}




