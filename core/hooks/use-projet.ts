import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/core/lib/rpc";
import { QueryKeyString } from "@/core/lib/constants";

import { useModal } from "@/core/providers/modal-provider";

import { toast } from "@/core/components/global/custom-toast";

// === Type Inference ===
type PostResponse = InferResponseType<(typeof client.api.projet)["$post"]>;
type PostRequest = InferRequestType<(typeof client.api.projet)["$post"]>;

type PatchResponse = InferResponseType<
  (typeof client.api.projet)[":projetId"]["$patch"],
  200
>;
type PatchRequest = InferRequestType<
  (typeof client.api.projet)[":projetId"]["$patch"]
>;

type DeleteResponse = InferResponseType<
  (typeof client.api.projet)[":projetId"]["$delete"],
  200
>;
type DeleteRequest = InferRequestType<
  (typeof client.api.projet)[":projetId"]["$delete"]
>;

// === Query: Get projet ===
export const useGetPojet = () => {
  return useQuery({
    queryKey: [QueryKeyString.projet],
    queryFn: async () => {
      const response = await client.api.projet.$get();

      if (!response.ok) {
        throw new Error("Échec de la récupération de la liste des projects");
      }

      const { data } = await response.json();

      const updatedData = data.map((item) => ({
        ...item,
        accompaniments: item.accompaniments.map((a) => ({
          ...a,

          createdAt: new Date(a.createdAt),
          updatedAt: new Date(a.updatedAt),
        })),
        startDate: new Date(item.startDate),
        endDate: new Date(item.endDate),

        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));

      return updatedData;
    },
  });
};

export const useGetOneProjet = (id: string) => {
  return useQuery({
    queryKey: [QueryKeyString.projet + id],
    queryFn: async () => {
      const response = await client.api.projet[":projetId"].$get({
        param: { projetId: id },
      });

      if (!response.ok) {
        throw new Error("Échec de la récupération de la liste des projects");
      }

      const { data } = await response.json();

      if (!data) {
        throw new Error("Aucun projcet trouvé.");
      }

      const updatedData = {
        ...data,

        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        members: data.members.map((m) => ({
          ...m,
          dob: new Date(m.dob),
          createdAt: new Date(m.createdAt),
          updatedAt: new Date(m.updatedAt),
          leave: m.leave
            ? {
                ...m.leave,
                date: new Date(m.leave.date),
                createdAt: new Date(m.leave.createdAt),
                updatedAt: new Date(m.leave.updatedAt),
              }
            : null,
        })),
        accompaniments: data.accompaniments.map((ac) => ({
          ...ac,
          members: ac.members.map((m) => ({
            ...m,
            dob: new Date(m.dob),
            createdAt: new Date(m.createdAt),
            updatedAt: new Date(m.updatedAt),
          })),
          users: {
            ...ac.users,
            dob: new Date(ac.users.dob),
            createdAt: new Date(ac.users.createdAt),
            updatedAt: new Date(ac.users.updatedAt),
          },
          createdAt: new Date(ac.createdAt),
          updatedAt: new Date(ac.updatedAt),
        })),
      };

      return updatedData;
    },
  });
};

// === Mutation: Create projet ===
export const useCreateProjet = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();

  return useMutation<PostResponse, Error, PostRequest>({
    mutationFn: async ({ json }: PostRequest) => {
      const response = await client.api.projet["$post"]({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success({ message: "Le project  a été enregistré avec succès" });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.projet] });
      close();
    },
    onError: (err) => {
      toast.error({
        message: `Échec de l'enregistrement du project : ${err.message}`,
      });
    },
  });
};

// === Mutation: Update projet ===
export const useUpdateProjet = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();

  return useMutation<PatchResponse, Error, PatchRequest>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.projet[":projetId"]["$patch"]({
        json,
        param,
      });

      return await res.json();
    },
    onSuccess: () => {
      toast.success({ message: "Le project a été modifié avec succès" });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.projet] });
      close();
    },
    onError: (err) => {
      toast.error({
        message: `Échec de la modification du project : ${err.message}`,
      });
    },
  });
};

// === Mutation: Delete projet ===
export const useDeleteProjet = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, DeleteRequest>({
    mutationFn: async ({ param }) => {
      const res = await client.api.projet[":projetId"]["$delete"]({ param });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      return await res.json();
    },

    onSuccess: () => {
      toast.success({ message: "Le project a été supprimé avec succès" });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.projet] });
    },
    onError: (err) => {
      toast.error({
        message: `Erreur lors de la suppression : ${err.message}`,
      });
    },
  });
};
