import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/core/lib/rpc";
import { QueryKeyString } from "@/core/lib/constants";

import { useModal } from "@/core/providers/modal-provider";

import { toast } from "../components/global/custom-toast";

// === Type Inference ===
type PostResponse = InferResponseType<(typeof client.api.admin)["$post"]>;
type PostRequest = InferRequestType<(typeof client.api.admin)["$post"]>;

type PatchResponse = InferResponseType<
  (typeof client.api.admin)[":aId"]["$patch"],
  200
>;
type PatchRequest = InferRequestType<
  (typeof client.api.admin)[":aId"]["$patch"]
>;

type DeleteResponse = InferResponseType<
  (typeof client.api.admin)[":aId"]["$delete"],
  200
>;
type DeleteRequest = InferRequestType<
  (typeof client.api.admin)[":aId"]["$delete"]
>;

// === Query: Get admin ===
export const useGetAdmins = () => {
  return useQuery({
    queryKey: [QueryKeyString.admins],
    queryFn: async () => {
      const response = await client.api.admin.$get();

      if (!response.ok) {
        throw new Error(
          "Échec de la récupération de la liste des utilisateurs"
        );
      }

      const { data } = await response.json();

      const updatedData = data.map((item) => ({
        ...item,

        dob: new Date(item.dob),
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));

      return updatedData;
    },
  });
};

export const useGetOnAdmin = (id: string) => {
  return useQuery({
    queryKey: [QueryKeyString.Oneaccompanist + id],
    queryFn: async () => {
      const response = await client.api.admin[":aId"].$get({
        param: { aId: id },
      });

      if (!response.ok) {
        throw new Error("Échec de la récupération de la liste des projects");
      }

      const { data } = await response.json();

      if (!data) {
        throw new Error("Aucun user trouvé.");
      }

      const updatedData = {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        dob: new Date(data.dob),
      };

      return updatedData;
    },
  });
};

// === Mutation: Create admin ===
export const useCreatAdmin = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();

  return useMutation<PostResponse, Error, PostRequest>({
    mutationFn: async ({ json }: PostRequest) => {
      const response = await client.api.admin["$post"]({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success({
        message: "L'administrateur  a été enregistré avec succès",
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.admins] });
      close();
    },
    onError: (err) => {
      toast.error({
        message: `Échec de l'enregistrement de l'administrateur : ${err.message}`,
      });
    },
  });
};

// === Mutation: Update admin ===
export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();

  return useMutation<PatchResponse, Error, PatchRequest>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.admin[":aId"]["$patch"]({
        json,
        param,
      });

      return await res.json();
    },
    onSuccess: () => {
      toast.success({ message: "L'administrateur a été modifié avec succès" });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.admins] });
      close();
    },
    onError: (err) => {
      toast.error({
        message: `Échec de la modification de l'administrateur : ${err.message}`,
      });
    },
  });
};

// === Mutation: Delete admin ===
export const useDeletAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, DeleteRequest>({
    mutationFn: async ({ param }) => {
      const res = await client.api.admin[":aId"]["$delete"]({ param });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      return await res.json();
    },

    onSuccess: () => {
      toast.success({ message: "L'administrateur a été supprimé avec succès" });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.admins] });
    },
    onError: (err) => {
      toast.error({
        message: `Erreur lors de la suppression : ${err.message}`,
      });
    },
  });
};
