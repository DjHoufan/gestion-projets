import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/core/lib/rpc";
import { QueryKeyString } from "@/core/lib/constants";

import { useModal } from "@/core/providers/modal-provider";

import { toast } from "@/core/components/global/custom-toast";
import { useMaps } from "@/core/hooks/store";

// === Type Inference ===
type PostResponse = InferResponseType<(typeof client.api.maps)["$post"]>;
type PostRequest = InferRequestType<(typeof client.api.maps)["$post"]>;

type PatchResponse = InferResponseType<
  (typeof client.api.maps)[":mapId"]["$patch"],
  200
>;
type PatchRequest = InferRequestType<
  (typeof client.api.maps)[":mapId"]["$patch"]
>;

type DeleteResponse = InferResponseType<
  (typeof client.api.maps)[":mapId"]["$delete"],
  200
>;
type DeleteRequest = InferRequestType<
  (typeof client.api.maps)[":mapId"]["$delete"]
>;

// === Query: Get maps ===
export const useGetMaps = () => {
  return useQuery({
    queryKey: [QueryKeyString.maps],
    queryFn: async () => {
      const response = await client.api.maps.$get();

      if (!response.ok) {
        throw new Error(
          "Échec de la récupération de la liste deses données de la maps"
        );
      }

      const { data } = await response.json();

      const updatedData = data.map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
        accompaniment: {
          ...item.accompaniment,
          createdAt: new Date(item.accompaniment.createdAt),
          updatedAt: new Date(item.accompaniment.updatedAt),
          users: {
            ...item.accompaniment.users,
            createdAt: new Date(item.accompaniment.users.createdAt),
            updatedAt: new Date(item.accompaniment.users.updatedAt),
            dob: new Date(item.accompaniment.users.dob),
          },
          members:
            item.accompaniment.members?.map((member) => ({
              ...member,
              createdAt: new Date(member.createdAt),
              updatedAt: new Date(member.updatedAt),
              dob: new Date(member.dob),
            })) ?? [],
        },
      }));

      return updatedData;
    },
  });
};

export const useGetOneMaps = (id: string) => {
  return useQuery({
    queryKey: [QueryKeyString.maps + id],
    queryFn: async () => {
      const response = await client.api.maps[":mapId"].$get({
        param: { mapId: id },
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
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        accompaniment: {
          ...data.accompaniment,
          createdAt: new Date(data.accompaniment.createdAt),
          updatedAt: new Date(data.accompaniment.updatedAt),
          users: {
            ...data.accompaniment.users,
            createdAt: new Date(data.accompaniment.users.createdAt),
            updatedAt: new Date(data.accompaniment.users.updatedAt),
            dob: new Date(data.accompaniment.users.dob),
          },
          members:
            data.accompaniment.members?.map((member) => ({
              ...member,
              createdAt: new Date(member.createdAt),
              updatedAt: new Date(member.updatedAt),
              dob: new Date(member.dob),
            })) ?? [],
        },
      };
      return updatedData;
    },
  });
};

// === Mutation: Create maps ===
export const useCreateMaps = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();
  const { setData } = useMaps();

  return useMutation<PostResponse, Error, PostRequest>({
    mutationFn: async ({ json }: PostRequest) => {
      const response = await client.api.maps["$post"]({ json });

      if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(errorBody);
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      const updatedData = {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),

        accompaniment: {
          ...data.accompaniment,
          createdAt: new Date(data.accompaniment.createdAt),
          updatedAt: new Date(data.accompaniment.updatedAt),
          users: {
            ...data.accompaniment.users,
            createdAt: new Date(data.accompaniment.users.createdAt),
            updatedAt: new Date(data.accompaniment.users.updatedAt),
            dob: new Date(data.accompaniment.users.dob),
          },
          members: data.accompaniment.members.map((member) => ({
            ...member,
            createdAt: new Date(member.createdAt),
            updatedAt: new Date(member.updatedAt),
            dob: new Date(member.dob),
          })),
        },
      };

      setData(updatedData);
      toast.success({
        message: "Les données de la map  a été enregistré avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.maps, QueryKeyString.Wmembers],
      });
      close();
    },
    onError: (err) => {
      // close();

      toast.error({
        message: `Échec de la création des données de la map : ${err.message}`,
      });
    },
  });
};

// === Mutation: Update maps ===
export const useUpdateMaps = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();
  const { setData } = useMaps();

  return useMutation<PatchResponse, Error, PatchRequest>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.maps[":mapId"]["$patch"]({
        json,
        param,
      });
      if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(errorBody);
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      const updatedData = {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),

        accompaniment: {
          ...data.accompaniment,
          createdAt: new Date(data.accompaniment.createdAt),
          updatedAt: new Date(data.accompaniment.updatedAt),
          users: {
            ...data.accompaniment.users,
            createdAt: new Date(data.accompaniment.users.createdAt),
            updatedAt: new Date(data.accompaniment.users.updatedAt),
            dob: new Date(data.accompaniment.users.dob),
          },
          members: data.accompaniment.members.map((member) => ({
            ...member,
            createdAt: new Date(member.createdAt),
            updatedAt: new Date(member.updatedAt),
            dob: new Date(member.dob),
          })),
        },
      };

      setData(updatedData);
      toast.success({
        message: "Les données de la map a été modifié avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.maps, QueryKeyString.Wmembers],
      });
      close();
    },
    onError: (err) => {
      close();

      const parsedError = JSON.parse(err.message);

      toast.error({
        message: `Échec de la mise a jour des données de la map : ${parsedError.message}`,
      });
    },
  });
};

// === Mutation: Delete maps ===
export const useDeletMaps = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, DeleteRequest>({
    mutationFn: async ({ param }) => {
      const res = await client.api.maps[":mapId"]["$delete"]({
        param,
      });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      return await res.json();
    },

    onSuccess: () => {
      toast.success({
        message: "Les données de la map a été supprimé avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.maps],
      });
    },
    onError: (err) => {
      toast.error({
        message: `Erreur lors de la suppression : ${err.message}`,
      });
    },
  });
};
