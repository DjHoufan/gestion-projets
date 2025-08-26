import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/core/lib/rpc";
import { QueryKeyString } from "@/core/lib/constants";

import { useModal } from "@/core/providers/modal-provider";

import { toast } from "@/core/components/global/custom-toast";

// === Type Inference Visite Terrain ===
type PostRpV = InferResponseType<(typeof client.api.rapport.visit)["$post"]>;
type PostRqV = InferRequestType<(typeof client.api.rapport.visit)["$post"]>;

type PatchRpV = InferResponseType<
  (typeof client.api.rapport.visit)[":vId"]["$patch"],
  200
>;
type PatchRqV = InferRequestType<
  (typeof client.api.rapport.visit)[":vId"]["$patch"]
>;

type DeleteRpV = InferResponseType<
  (typeof client.api.rapport.visit)[":vId"]["$delete"],
  200
>;
type DeleteRqV = InferRequestType<
  (typeof client.api.rapport.visit)[":vId"]["$delete"]
>;

// === Query: Get Visite Terrain ===
export const useGetVisiteTerrain = () => {
  return useQuery({
    queryKey: [QueryKeyString.vt],
    queryFn: async () => {
      const response = await client.api.rapport.visit.$get();

      if (!response.ok) {
        throw new Error(
          "Échec de la récupération de la liste deses données de la rapport"
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
        visit: {
          ...item.visit,
          date: new Date(item.visit.date),
          Planning: {
            ...item.visit.Planning,
            accompaniments: item.visit.Planning.accompaniments.map((value) => ({
              ...value,
              members: value.members.map((m) => ({
                ...m,
                dob: new Date(m.dob),
                createdAt: new Date(m.createdAt),
                updatedAt: new Date(m.updatedAt),
              })),
              createdAt: new Date(value.createdAt),
              updatedAt: new Date(value.updatedAt),
            })),
          },
        },
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));

      return updatedData;
    },
  });
};

// === Query: Get one Visite Terrain ===
export const useGetOneVisiteTerrain = (id: string) => {
  return useQuery({
    queryKey: [QueryKeyString.vt + id],
    queryFn: async () => {
      const response = await client.api.rapport.visit[":vId"].$get({
        param: { vId: id },
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
        users: {
          ...data.users,
          dob: new Date(data.users.dob),
          createdAt: new Date(data.users.createdAt),
          updatedAt: new Date(data.users.updatedAt),
        },
        visit: {
          ...data.visit,
          date: new Date(data.visit.date),

          Planning: {
            ...data.visit.Planning,
            accompaniments: data.visit.Planning.accompaniments.map((value) => ({
              ...value,
              members: value.members.map((m) => ({
                ...m,
                dob: new Date(m.dob),
                createdAt: new Date(m.createdAt),
                updatedAt: new Date(m.updatedAt),
              })),
            })),
          },
        },
      };
      return updatedData;
    },
  });
};

// === Mutation: Create Visite Terrain ===
export const useCreateVisiteTerrain = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();

  return useMutation<PostRpV, Error, PostRqV>({
    mutationFn: async ({ json }: PostRqV) => {
      const response = await client.api.rapport.visit["$post"]({ json });

      if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(errorBody);
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success({
        message:
          "Les données de la visite de terrain  a été enregistré avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.vt],
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

// === Mutation: Update VisiteTerrain ===
export const useUpdateVisiteTerrain = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();

  return useMutation<PatchRpV, Error, PatchRqV>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.rapport.visit[":vId"]["$patch"]({
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
        queryKey: [QueryKeyString.vt],
      });
      close();
    },
    onError: (err) => {
      close();

      const parsedError = JSON.parse(err.message);

      toast.error({
        message: `Échec de la mise a jour des données de la visite de terrain : ${parsedError.message}`,
      });
    },
  });
};

// === Mutation: Delete VisiteTerrain ===
export const useDeleteVisiteTerrain = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteRpV, Error, DeleteRqV>({
    mutationFn: async ({ param }) => {
      const res = await client.api.rapport.visit[":vId"]["$delete"]({
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
        queryKey: [QueryKeyString.vt],
      });
    },
    onError: (err) => {
      toast.error({
        message: `Erreur lors de la suppression : ${err.message}`,
      });
    },
  });
};
