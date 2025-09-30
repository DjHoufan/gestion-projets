import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/core/lib/rpc";
import { QueryKeyString } from "@/core/lib/constants";

import { toast } from "@/core/components/global/custom-toast";
import { useMyData } from "@/core/hooks/store";
import { useModal } from "@/core/providers/modal-provider";

// === Type Inference Conflit  ===
type PostRpV = InferResponseType<(typeof client.api.rapport.conflit)["$post"]>;
type PostRqV = InferRequestType<(typeof client.api.rapport.conflit)["$post"]>;

type PatchRpV = InferResponseType<
  (typeof client.api.rapport.conflit)[":cId"]["$patch"],
  200
>;
type PatchRqV = InferRequestType<
  (typeof client.api.rapport.conflit)[":cId"]["$patch"]
>;

type DeleteRpV = InferResponseType<
  (typeof client.api.rapport.conflit)[":cId"]["$delete"],
  200
>;
type DeleteRqV = InferRequestType<
  (typeof client.api.rapport.conflit)[":cId"]["$delete"]
>;

// === Query: Get Conflit ===
export const useGetConflit = () => {
  return useQuery({
    queryKey: [QueryKeyString.conflits],
    queryFn: async () => {
      const response = await client.api.rapport.conflit.$get();

      if (!response.ok) {
        throw new Error(
          "Échec de la récupération de la liste des données du conflit"
        );
      }

      const { data } = await response.json();

      const updatedData = data.map((item) => ({
        ...item,
        users: {
          ...item.users,
          dob: new Date(item.users.dob),
          createdAt: new Date(item.users.createdAt),
          updatedAt: new Date(item.users.updatedAt),
        },
        accompaniment: {
          ...item.accompaniment,
          createdAt: new Date(item.accompaniment.createdAt),
          updatedAt: new Date(item.accompaniment.updatedAt),
        },

        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));

      return updatedData;
    },
  });
};

// === Query: Get one Conflit  ===
export const useGetOneConflit = (id: string) => {
  return useQuery({
    queryKey: [QueryKeyString.conflits + id],
    queryFn: async () => {
      const response = await client.api.rapport.conflit[":cId"].$get({
        param: { cId: id },
      });

      if (!response.ok) {
        throw new Error("Échec de la récupération des données");
      }

      const { data } = await response.json();

      if (!data) {
        throw new Error("Aucun conflit trouvé.");
      }

      const updatedData = {
        ...data,

        users: {
          ...data.users,
          dob: new Date(data.users.dob),
          createdAt: new Date(data.users.createdAt),
          updatedAt: new Date(data.users.updatedAt),
        },
        accompaniment: {
          ...data.accompaniment,
          createdAt: new Date(data.accompaniment.createdAt),
          updatedAt: new Date(data.accompaniment.updatedAt),
        },

        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };
      return updatedData;
    },
  });
};

// === Mutation: Create Conflit  ===
export const useCreateConflit = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();
  const { data: user, updateFields } = useMyData();

  return useMutation<PostRpV, Error, PostRqV>({
    mutationFn: async ({ json }: PostRqV) => {
      const response = await client.api.rapport.conflit["$post"]({ json });

      if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(errorBody);
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {


      
      queryClient.setQueryData<any>(
        ["accompanist", data?.usersId!],
        (oldData: any) => {
          return {
            ...(oldData ?? {}),
            conflit: [...((oldData?.conflit as any[]) ?? []), data],
          };
        }
      );

      updateFields({
        conflit: [
          //@ts-ignore
          ...(user?.conflit || []),
          //@ts-ignore
          data,
        ],
      });

      toast.success({
        message: "Les données du Conflit de   a été enregistré avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.conflits],
      });
      close();
    },
    onError: (err) => {
      // close();

      toast.error({
        message: `Échec de la création des données du Conflit de  : ${err.message}`,
      });
    },
  });
};

// === Mutation: Update Conflit ===
export const useUpdateConflit = () => {
  const queryClient = useQueryClient();

  return useMutation<PatchRpV, Error, PatchRqV>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.rapport.conflit[":cId"]["$patch"]({
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
      toast.success({
        message: "Les données du Conflit de  a été modifié avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.conflits],
      });
    },
    onError: (err) => {
      const parsedError = JSON.parse(err.message);

      toast.error({
        message: `Échec de la mise a jour des données du Conflit de  : ${parsedError.message}`,
      });
    },
  });
};

// === Mutation: Delete Conflit ===
export const useDeleteConflit = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteRpV, Error, DeleteRqV>({
    mutationFn: async ({ param }) => {
      const res = await client.api.rapport.conflit[":cId"]["$delete"]({
        param,
      });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      return await res.json();
    },

    onSuccess: () => {
      toast.success({
        message: "Les données du Conflit du  a été supprimé avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.conflits],
      });
    },
    onError: (err) => {
      toast.error({
        message: `Erreur lors de la suppression : ${err.message}`,
      });
    },
  });
};
