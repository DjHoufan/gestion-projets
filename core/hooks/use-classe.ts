import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/core/lib/rpc";
import { QueryKeyString } from "@/core/lib/constants";

import { useModal } from "@/core/providers/modal-provider";

import { toast } from "../components/global/custom-toast";
import { Prisma } from "@prisma/client";
import { useClasseMembers } from "@/core/hooks/store";

// === Type Inference ===
type PostResponse = InferResponseType<(typeof client.api.classe)["$post"]>;
type PostRequest = InferRequestType<(typeof client.api.classe)["$post"]>;

type PatchResponse = InferResponseType<
  (typeof client.api.classe)[":cId"]["$patch"],
  200
>;
type PatchRequest = InferRequestType<
  (typeof client.api.classe)[":cId"]["$patch"]
>;

type DeleteResponse = InferResponseType<
  (typeof client.api.classe)[":cId"]["$delete"],
  200
>;
type DeleteRequest = InferRequestType<
  (typeof client.api.classe)[":cId"]["$delete"]
>;

// === Query: Get classe ===
export const useGetClasses = () => {
  return useQuery({
    queryKey: [QueryKeyString.classes],
    queryFn: async () => {
      const response = await client.api.classe.$get();

      if (!response.ok) {
        throw new Error("Échec de la récupération de la liste des classes");
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
        user: {
          ...item.user,
          dob: new Date(item.user.dob),
          createdAt: new Date(item.user.createdAt),
          updatedAt: new Date(item.user.updatedAt),
        },
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));

      return updatedData;
    },
  });
};

export const useGetOneClasse = (id: string) => {
  const { setData } = useClasseMembers();
  return useQuery({
    queryKey: [QueryKeyString.classes + id],
    queryFn: async () => {
      const response = await client.api.classe[":cId"].$get({
        param: { cId: id },
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
        project: {
          ...data.project,
          startDate: new Date(data.project.startDate),
          endDate: new Date(data.project.endDate),
          createdAt: new Date(data.project.createdAt),
          updatedAt: new Date(data.project.updatedAt),
        },
        user: {
          ...data.user,
          dob: new Date(data.user.dob),
          createdAt: new Date(data.user.createdAt),
          updatedAt: new Date(data.user.updatedAt),
        },
        members: data.members.map((m) => ({
          ...m,
          dob: new Date(m.dob),
          createdAt: new Date(m.createdAt),
          updatedAt: new Date(m.updatedAt),
          statut: m.leave ? "oui" : "non",
          leave: m.leave
            ? {
                ...m.leave,
                date: new Date(m.leave.date),
                createdAt: new Date(m.leave.createdAt),
                updatedAt: new Date(m.leave.updatedAt),
              }
            : null,
        })),

        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };

      setData(updatedData.members);

      return updatedData;
    },
  });
};

// === Mutation: Create classe ===
export const useCreateClasse = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();

  return useMutation<PostResponse, Error, PostRequest>({
    mutationFn: async ({ json }: PostRequest) => {
      const response = await client.api.classe["$post"]({ json });

      if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(errorBody);
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success({ message: "La classe  a été enregistré avec succès" });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.classes] });
      close();
    },
    onError: (err) => {
      toast.error({
        message: `Erreur: ${err.message}`,
      });
    },
  });
};

// === Mutation: Update classe ===
export const useUpdateClasse = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();

  return useMutation<PatchResponse, Error, PatchRequest>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.classe[":cId"]["$patch"]({
        json,
        param,
      });

      if (!res.ok) {
        const errorBody = await res.text();

        throw new Error(`Erreur API: ${res.status} - ${errorBody}`);
      }

      return await res.json();
    },
    onSuccess: () => {
      toast.success({ message: "La classe a été modifié avec succès" });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.classes] });
      close();
    },
    onError: (err) => {
      toast.error({
        message: `Erreur: ${err.message}`,
      });
    },
  });
};

// === Mutation: Delete classe ===
export const useDeletClasse = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, DeleteRequest>({
    mutationFn: async ({ param }) => {
      const res = await client.api.classe[":cId"]["$delete"]({ param });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      return await res.json();
    },

    onSuccess: () => {
      toast.success({ message: "La classe a été supprimé avec succès" });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.classes] });
    },
    onError: (err) => {
      toast.error({
        message: `Erreur lors de la suppression : ${err.message}`,
      });
    },
  });
};
