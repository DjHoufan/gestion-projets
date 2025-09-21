import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/core/lib/rpc";
import { QueryKeyString } from "@/core/lib/constants";

import { useModal } from "@/core/providers/modal-provider";

import { toast } from "@/core/components/global/custom-toast";
import { useMyData } from "@/core/hooks/store";

// === Type Inference Rencontre ===
type PostRpV = InferResponseType<
  (typeof client.api.rapport.rencontre)["$post"]
>;
type PostRqV = InferRequestType<(typeof client.api.rapport.rencontre)["$post"]>;

type PatchRpV = InferResponseType<
  (typeof client.api.rapport.rencontre)[":rId"]["$patch"],
  200
>;
type PatchRqV = InferRequestType<
  (typeof client.api.rapport.rencontre)[":rId"]["$patch"]
>;

type DeleteRpV = InferResponseType<
  (typeof client.api.rapport.rencontre)[":rId"]["$delete"],
  200
>;
type DeleteRqV = InferRequestType<
  (typeof client.api.rapport.rencontre)[":rId"]["$delete"]
>;

// === Query: Get Rencontre ===
export const useGetRencontre = () => {
  return useQuery({
    queryKey: [QueryKeyString.rencontre],
    queryFn: async () => {
      const response = await client.api.rapport.rencontre.$get();

      if (!response.ok) {
        throw new Error(
          "Échec de la récupération de la liste deses données de la rapport"
        );
      }

      const { data } = await response.json();

      const updatedData = data.map((item) => ({
        ...item,
        visit: {
          ...item.visit,

          date: new Date(item.visit.date),
        },

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
        signatures: item.signatures.map((s) => ({
          ...s,
          date: new Date(s.date),

          member: {
            ...s.member,
            dob: new Date(s.member.dob),
            createdAt: new Date(s.member.createdAt),
            updatedAt: new Date(s.member.updatedAt),
          },
        })),
      }));

      return updatedData;
    },
  });
};

// === Query: Get one Rencontre ===
export const useGetOneRencontre = (id: string) => {
  return useQuery({
    queryKey: [QueryKeyString.rencontre + id],
    queryFn: async () => {
      const response = await client.api.rapport.rencontre[":rId"].$get({
        param: { rId: id },
      });

      if (!response.ok) {
        throw new Error("Échec de la récupération des données");
      }

      const { data } = await response.json();

      if (!data) {
        throw new Error("Aucun projcet trouvé.");
      }

      const updatedData = {
        ...data,
        visit: {
          ...data.visit,

          date: new Date(data.visit.date),
        },
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
        signatures: data.signatures.map((s) => ({
          ...s,
          member: {
            ...s.member,
            dob: new Date(s.member.dob),
            createdAt: new Date(s.member.createdAt),
            updatedAt: new Date(s.member.updatedAt),
          },
        })),
      };
      return updatedData;
    },
  });
};

// === Mutation: Create Rencontre ===
export const useCreateRencontre = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();
  const { data: user, updateFields } = useMyData();

  return useMutation<PostRpV, Error, PostRqV>({
    mutationFn: async ({ json }: PostRqV) => {
      const response = await client.api.rapport.rencontre["$post"]({ json });

      if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(errorBody);
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      if (data) {
        updateFields({
          rencontres: [
            //@ts-ignore
            ...(user?.rencontres || []),
            //@ts-ignore
            data,
          ],
        });
      }

      toast.success({
        message:
          "Les données de la visite de terrain  a été enregistré avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.rencontre],
      });
      close();
    },
    onError: (err) => {
      // close();

      toast.error({
        message: `Échec de la création des données de la visite de terrain : ${err.message}`,
      });
    },
  });
};

// === Mutation: Update Rencontre ===
export const useUpdateRencontre = () => {
  const queryClient = useQueryClient();

  return useMutation<PatchRpV, Error, PatchRqV>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.rapport.rencontre[":rId"]["$patch"]({
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
        message:
          "Les données de la visite de terrain a été modifié avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.rencontre],
      });
    },
    onError: (err) => {
      const parsedError = JSON.parse(err.message);

      toast.error({
        message: `Échec de la mise a jour des données de la visite de terrain : ${parsedError.message}`,
      });
    },
  });
};

// === Mutation: Delete Rencontre ===
export const useDeleteRencontre = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteRpV, Error, DeleteRqV>({
    mutationFn: async ({ param }) => {
      const res = await client.api.rapport.rencontre[":rId"]["$delete"]({
        param,
      });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      return await res.json();
    },

    onSuccess: () => {
      toast.success({
        message:
          "Les données de la visite du terrain a été supprimé avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.rencontre],
      });
    },
    onError: (err) => {
      toast.error({
        message: `Erreur lors de la suppression : ${err.message}`,
      });
    },
  });
};
