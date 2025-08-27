import { QueryKeyString } from "@/core/lib/constants";
import { MessageDetail } from "@/core/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/core/lib/rpc";
import { useModal } from "@/core/providers/modal-provider";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "@/core/components/global/custom-toast";

// Simulation d'une API avec pagination
export interface PaginatedMessages {
  messages: MessageDetail[];
  nextCursor?: string;
  hasNextPage: boolean;
  totalCount: number;
}

export interface GetMessagesParams {
  chatId: string;
  cursor?: string;
  limit?: number;
}

export async function getMessages({
  chatId,
  cursor,
  limit = 20,
}: GetMessagesParams): Promise<PaginatedMessages> {
  const response = await client.api.chat.message[":chatId"].$get({
    param: {
      chatId: chatId,
    },
  });

  if (!response.ok) {
    throw new Error("Échec de la récupération de la liste des messages");
  }

  const { data } = await response.json();

  const fullMessageList = data.map((item: any) => ({
    ...item,
    sender: {
      ...item.sender,
      dob: new Date(item.sender.dob),
      createdAt: new Date(item.sender.createdAt),
      updatedAt: new Date(item.sender.updatedAt),
    },
    sentAt: new Date(item.sentAt),
  }));

  // Trier par date croissante (plus ancien au plus récent)
  fullMessageList.sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime());

  if (!cursor) {
    // Première charge - retourne les messages les plus récents
    const recentMessages = fullMessageList.slice(-limit);
    const hasMore = fullMessageList.length > limit;
    const nextCursor = hasMore ? fullMessageList.length - limit : undefined;

    return {
      messages: recentMessages,
      nextCursor: nextCursor ? `cursor_${nextCursor}` : undefined,
      hasNextPage: hasMore,
      totalCount: fullMessageList.length,
    };
  }

  // Pagination - charge les messages plus anciens
  const cursorIndex = Number.parseInt(cursor.split("_")[1]);
  const endIndex = cursorIndex;
  const startIndex = Math.max(0, endIndex - limit);

  const messages = fullMessageList.slice(startIndex, endIndex);
  const hasMore = startIndex > 0;
  const nextCursor = hasMore ? startIndex : undefined;

  return {
    messages,
    nextCursor: nextCursor ? `cursor_${nextCursor}` : undefined,
    hasNextPage: hasMore,
    totalCount: fullMessageList.length,
  };
}

export async function sendMessage(
  chatId: string,
  content: string,
  senderId: string
) {
  const message = await client.api.chat.messages["$post"]({
    json: {
      chatId: chatId,
      content: content,
      senderId: senderId,
    },
  });

  if (!message.ok) {
    throw new Error("Échec de la récupération de la liste des utilisateurs");
  }

  const { data } = await message.json();

  const updatedData = {
    ...data,
    sentAt: new Date(data.sentAt),
    sender: {
      ...data.sender,
      dob: new Date(data.sender.dob),
      createdAt: new Date(data.sender.createdAt),
      updatedAt: new Date(data.sender.updatedAt),
    },
  };

  return updatedData;
}

export const useGetAllChats = () => {
  return useQuery({
    queryKey: [QueryKeyString.chat],
    queryFn: async () => {
      const response = await client.api.chat.$get();

      if (!response.ok) {
        throw new Error(
          "Échec de la récupération de la liste des utilisateurs"
        );
      }

      const { data } = await response.json();

      const updatedData = data.map((item) => ({
        ...item,

        project: {
          ...item.project,
          startDate: new Date(item.project.startDate),
          endDate: new Date(item.project.endDate),
          createdAt: new Date(item.project.createdAt),
          updatedAt: new Date(item.project.updatedAt),
        },
        participants: item.participants.map((p) => ({
          ...p,
          user: {
            ...p.user,
            dob: new Date(p.user.dob),
            createdAt: new Date(p.user.createdAt),
            updatedAt: new Date(p.user.updatedAt),
          },
          joinedAt: new Date(p.joinedAt),
        })),
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));

      return updatedData;
    },
  });
};

type PostRes = InferResponseType<
  (typeof client.api.chat.participants)[":userId"][":chatId"]["$post"]
>;
type PostReq = InferRequestType<
  (typeof client.api.chat.participants)[":userId"][":chatId"]["$post"]
>;

export const useAddParticipants = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();

  return useMutation<PostRes, Error, PostReq>({
    mutationFn: async ({ param }: PostReq) => {
      const response = await client.api.chat.participants[":userId"][":chatId"][
        "$post"
      ]({ param });
      return await response.json();
    },
    onSuccess: () => {
      toast.success({ message: "Le participant a été ajouté avec succès" });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.chat] });
      close();
    },
    onError: (err) => {
      toast.error({
        message: `Échec de l'ajout du participant: ${err.message}`,
      });
    },
  });
};

type DelRes = InferResponseType<
  (typeof client.api.chat.participants)[":pId"]["$delete"],
  200
>;
type DelReq = InferRequestType<
  (typeof client.api.chat.participants)[":pId"]["$delete"]
>;
export const useRemoveParticipants = () => {
  const queryClient = useQueryClient();

  return useMutation<DelRes, Error, DelReq>({
    mutationFn: async ({ param }) => {
      const res = await client.api.chat.participants[":pId"]["$delete"]({
        param,
      });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      return await res.json();
    },

    onSuccess: () => {
      toast.success({ message: "Le participant  a été supprimé avec succès" });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.team] });
    },
    onError: (err) => {
      toast.error({
        message: `Erreur lors de la suppression : ${err.message}`,
      });
    },
  });
};

export const useGetMyChat = (userId: string) => {
  return useQuery({
    queryKey: [QueryKeyString.mychat],
    queryFn: async () => {
      const response = await client.api.chat.myChat[":userId"].$get({
        param: {
          userId,
        },
      });

      if (!response.ok) {
        throw new Error("Échec de la récupération de la liste des projects");
      }

      const { data } = await response.json();

      if (!data) {
        throw new Error("Aucun projcet trouvé.");
      }

      const updatedData = data.map((item) => ({
        ...item,

        project: {
          ...item.project,
          startDate: new Date(item.project.startDate),
          endDate: new Date(item.project.endDate),
          createdAt: new Date(item.project.createdAt),
          updatedAt: new Date(item.project.updatedAt),
        },
        participants: item.participants.map((p) => ({
          ...p,
          user: {
            ...p.user,
            dob: new Date(p.user.dob),
            createdAt: new Date(p.user.createdAt),
            updatedAt: new Date(p.user.updatedAt),
          },
          joinedAt: new Date(p.joinedAt),
        })),
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));

      return updatedData;
    },
  });
};

export const useGetMyMessageView = (userId: string) => {
  return useQuery({
    queryKey: [QueryKeyString.notification + userId],
    queryFn: async () => {
      const response = await client.api.chat.messageView[":userId"].$get({
        param: { userId: userId },
      });

      if (!response.ok) {
        throw new Error("Échec de la récupération de la liste des projects");
      }

      const { data } = await response.json();

      if (!data) {
        throw new Error("Aucun user trouvé.");
      }

      const updatedData = data.map((item) => ({
        ...item,
        user: {
          ...item.user,
          createdAt: new Date(item.user.createdAt),
          updatedAt: new Date(item.user.updatedAt),
          dob: new Date(item.user.dob),
        },
        message: {
          ...item.message,

          sentAt: new Date(item.message.sentAt),
        },
      }));

      return updatedData;
    },
  });
};

export const useGetMyMessageViewAll = (userId: string) => {
  return useQuery({
    queryKey: [userId],
    queryFn: async () => {
      const response = await client.api.chat.messageViewAll[":userId"].$get({
        param: { userId: userId },
      });

      if (!response.ok) {
        throw new Error("Échec de la récupération de la liste des projects");
      }

      const { data } = await response.json();

      if (!data) {
        throw new Error("Aucun user trouvé.");
      }

      const updatedData = data.map((item) => ({
        ...item,
        user: {
          ...item.user,
          createdAt: new Date(item.user.createdAt),
          updatedAt: new Date(item.user.updatedAt),
          dob: new Date(item.user.dob),
        },
        message: {
          ...item.message,
          sentAt: new Date(item.message.sentAt),
          sender: {
            ...item.message.sender,
            createdAt: new Date(item.message.sender.createdAt),
            updatedAt: new Date(item.message.sender.updatedAt),
            dob: new Date(item.message.sender.dob),
          },
        },
      }));

      return updatedData;
    },
  });
};

type PatchRes = InferResponseType<
  (typeof client.api.chat.messageView)[":mvId"]["$patch"],
  200
>;
type PatchReq = InferRequestType<
  (typeof client.api.chat.messageView)[":mvId"]["$patch"]
>;

export const useUpdateMessageView = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation<PatchRes, Error, PatchReq>({
    mutationFn: async ({ param }) => {
      const res = await client.api.chat.messageView[":mvId"]["$patch"]({
        param,
      });

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.notification + userId],
      });
    },
    onError: (err) => {
      toast.error({
        message: `Échec de la modification de l'administrateur : ${err.message}`,
      });
    },
  });
};

export const useUpdateAllMyMessageView = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await client.api.chat.AllMymessageView[":userId"]["$patch"]({
        param: { userId: userId },
      });

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.notification + userId],
      });
    },
    onError: (err) => {
      toast.error({
        message: `Échec de la modification de l'administrateur : ${err.message}`,
      });
    },
  });
};
