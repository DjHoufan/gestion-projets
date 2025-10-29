import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/core/lib/rpc";
import { QueryKeyString } from "@/core/lib/constants";

import { useModal } from "@/core/providers/modal-provider";

import { toast } from "../components/global/custom-toast";

// === Type Inference ===
type PostResponse = InferResponseType<(typeof client.api.trainer)["$post"]>;
type PostRequest = InferRequestType<(typeof client.api.trainer)["$post"]>;

type PatchResponse = InferResponseType<
  (typeof client.api.trainer)[":tId"]["$patch"],
  200
>;
type PatchRequest = InferRequestType<
  (typeof client.api.trainer)[":tId"]["$patch"]
>;

type DeleteResponse = InferResponseType<
  (typeof client.api.trainer)[":tId"]["$delete"],
  200
>;
type DeleteRequest = InferRequestType<
  (typeof client.api.trainer)[":tId"]["$delete"]
>;

// === Query: Get trainer ===
export const useGetTrainers = () => {
  return useQuery({
    queryKey: [QueryKeyString.trainers, "all"],
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    queryFn: async () => {
      const response = await client.api.trainer.$get();

      if (!response.ok) {
        throw new Error(
          "Échec de la récupération de la liste des utilisateurs"
        );
      }

      const { data } = await response.json();

      const updatedData = data.map((item) => ({
        ...item,
        date: new Date(item.date),

        user: {
          ...item.user,
          dob: new Date(item.user.dob),
          createdAt: new Date(item.user.createdAt),
          updatedAt: new Date(item.user.updatedAt),
        },
      }));

      return updatedData;
    },
  });
};

// === Query: Get One trainer ===
export const useGetOnTrainer = (id: string) => {
  return useQuery({
    queryKey: [QueryKeyString.trainers, "one", id],
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    queryFn: async () => {
      const response = await client.api.trainer[":tId"].$get({
        param: { tId: id },
      });

      if (!response.ok) {
        throw new Error("Échec de la récupération de la liste des rapport");
      }

      const { data } = await response.json();

      if (!data) {
        throw new Error("Aucun user trouvé.");
      }

      const updatedData = {
        ...data,
        date: new Date(data.date),

        user: {
          ...data.user,
          dob: new Date(data.user.dob),
          createdAt: new Date(data.user.createdAt),
          updatedAt: new Date(data.user.updatedAt),
        },
      };

      return updatedData;
    },
  });
};

// === Query: Get My trainer ===

export const useGetMyTrainer = (id: string) => {
  return useQuery({
    queryKey: [QueryKeyString.trainers, "my", id],
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    queryFn: async () => {
      const response = await client.api.trainer.my[":userId"].$get({
        param: { userId: id },
      });

      if (!response.ok) {
        throw new Error("Échec de la récupération de la liste des rapports");
      }

      const { data } = await response.json();

      if (!data) {
        throw new Error("Aucun user trouvé.");
      }
      const updatedData = data.map((item) => ({
        ...item,
        date: new Date(item.date),

        user: {
          ...item.user,
          dob: new Date(item.user.dob),
          createdAt: new Date(item.user.createdAt),
          updatedAt: new Date(item.user.updatedAt),
        },
      }));

      return updatedData;
    },
  });
};

// === Mutation: Create trainer ===
export const useCreateTrainer = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();

  return useMutation<PostResponse, Error, PostRequest>({
    mutationFn: async ({ json }: PostRequest) => {
      const response = await client.api.trainer["$post"]({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success({
        message: "Le rapport du formateur a été sauvegardé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.trainers] });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.trainers, "all"] });
      close();
    },
    onError: (err) => {
      toast.error({
        message: `Impossible d'enregistrer le rapport du formateur : ${err.message}`,
      });
    },
  });
};

// === Mutation: Update trainer ===
export const useUpdateTrainer = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();

  return useMutation<PatchResponse, Error, PatchRequest>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.trainer[":tId"]["$patch"]({
        json,
        param,
      });

      return await res.json();
    },
    onSuccess: () => {
      toast.success({
        message:
          "La modification du rapport du formateur a été effectuée avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.trainers] });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.trainers, "all"] });
      close();
    },
    onError: (err) => {
      toast.error({
        message: `La modification du rapport du formateur a échoué. : ${err.message}`,
      });
    },
  });
};

// === Mutation: Delete trainer ===
export const useDeletTrainer = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, DeleteRequest>({
    mutationFn: async ({ param }) => {
      const res = await client.api.trainer[":tId"]["$delete"]({ param });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      return await res.json();
    },

    onSuccess: () => {
      toast.success({
        message: "Le rapport du formateur a été supprimé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.trainers] });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.trainers, "all"] });
    },
    onError: (err) => {
      toast.error({
        message: `Erreur lors de la suppression : ${err.message}`,
      });
    },
  });
};
