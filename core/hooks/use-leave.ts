import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/core/lib/rpc";
import { QueryKeyString } from "@/core/lib/constants";

import { useModal } from "@/core/providers/modal-provider";

import { toast } from "../components/global/custom-toast";

// === Type Inference ===
type PostResponse = InferResponseType<(typeof client.api.leave)["$post"]>;
type PostRequest = InferRequestType<(typeof client.api.leave)["$post"]>;

type PatchResponse = InferResponseType<
  (typeof client.api.leave)[":lId"]["$patch"],
  200
>;
type PatchRequest = InferRequestType<
  (typeof client.api.leave)[":lId"]["$patch"]
>;

type DeleteResponse = InferResponseType<
  (typeof client.api.leave)[":lId"]["$delete"],
  200
>;
type DeleteRequest = InferRequestType<
  (typeof client.api.leave)[":lId"]["$delete"]
>;

// === Query: Get leave ===
export const useGetLeaves = () => {
  return useQuery({
    queryKey: [QueryKeyString.leaves],
    queryFn: async () => {
      const response = await client.api.leave.$get();

      if (!response.ok) {
        throw new Error("Échec de la récupération de la liste des abandons");
      }

      const { data } = await response.json();

      const updatedData = data.map((item) => ({
        ...item,

        date: new Date(item.date),

        member: {
          ...item.member,
          dob: new Date(item.member.dob),
          createdAt: new Date(item.member.createdAt),
          updatedAt: new Date(item.member.updatedAt),
        },
        project: {
          ...item.project,
          startDate: new Date(item.project.startDate),
          endDate: new Date(item.project.endDate),
          createdAt: new Date(item.project.createdAt),
          updatedAt: new Date(item.project.updatedAt),
        },
      }));

      return updatedData;
    },
  });
};

export const useGetOnLeave = (id: string) => {
  return useQuery({
    queryKey: [QueryKeyString.Oneaccompanist + id],
    queryFn: async () => {
      const response = await client.api.leave[":lId"].$get({
        param: { lId: id },
      });

      if (!response.ok) {
        throw new Error("Échec de la récupération de la liste des abandons");
      }

      const { data } = await response.json();

      if (!data) {
        throw new Error("Aucun user trouvé.");
      }

      const updatedData = {
        ...data,
        date: new Date(data.date),

        member: {
          ...data.member,
          dob: new Date(data.member.dob),
          createdAt: new Date(data.member.createdAt),
          updatedAt: new Date(data.member.updatedAt),
        },
        project: {
          ...data.project,
          startDate: new Date(data.project.startDate),
          endDate: new Date(data.project.endDate),
          createdAt: new Date(data.project.createdAt),
          updatedAt: new Date(data.project.updatedAt),
        },
      };

      return updatedData;
    },
  });
};

// === Mutation: Create leave ===
export const useCreatLeave = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();

  return useMutation<PostResponse, Error, PostRequest>({
    mutationFn: async ({ json }: PostRequest) => {
      const response = await client.api.leave["$post"]({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success({
        message: "un abandon a été enregistré avec succès",
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.leaves] });
      close();
    },
    onError: (err) => {
      toast.error({
        message: `Échec de l'enregistrement de un l'abandon : ${err.message}`,
      });
    },
  });
};

// === Mutation: Update leave ===
export const useUpdateleave = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();

  return useMutation<PatchResponse, Error, PatchRequest>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.leave[":lId"]["$patch"]({
        json,
        param,
      });

      return await res.json();
    },
    onSuccess: () => {
      toast.success({ message: "L'abandon a été modifié avec succès" });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.leaves] });
      close();
    },
    onError: (err) => {
      toast.error({
        message: `Échec de la modification de l'abandon : ${err.message}`,
      });
    },
  });
};

// === Mutation: Delete leave ===
export const useDeletleave = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, DeleteRequest>({
    mutationFn: async ({ param }) => {
      const res = await client.api.leave[":lId"]["$delete"]({ param });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      return await res.json();
    },

    onSuccess: () => {
      toast.success({ message: "L'abandon a été supprimé avec succès" });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.leaves] });
    },
    onError: (err) => {
      toast.error({
        message: `Erreur lors de la suppression : ${err.message}`,
      });
    },
  });
};
