import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/core/lib/rpc";
import { QueryKeyString } from "@/core/lib/constants";

import { useModal } from "@/core/providers/modal-provider";

import { toast } from "@/core/components/global/custom-toast";
import { useMyData } from "@/core/hooks/store";

// === Type Inference Emargement ===
type PostResponse = InferResponseType<
  (typeof client.api.rapport.emargement)["$post"]
>;
type PostRequest = InferRequestType<
  (typeof client.api.rapport.emargement)["$post"]
>;

type PatchResponse = InferResponseType<
  (typeof client.api.rapport.emargement)[":emId"]["$patch"],
  200
>;
type PatchRequest = InferRequestType<
  (typeof client.api.rapport.emargement)[":emId"]["$patch"]
>;

type DeleteResponse = InferResponseType<
  (typeof client.api.rapport.emargement)[":emId"]["$delete"],
  200
>;
type DeleteRequest = InferRequestType<
  (typeof client.api.rapport.emargement)[":emId"]["$delete"]
>;

// === Query: Get Emargement ===
export const useGetEmargement = () => {
  return useQuery({
    queryKey: [QueryKeyString.rapports],
    queryFn: async () => {
      const response = await client.api.rapport.emargement.$get();

      if (!response.ok) {
        throw new Error(
          "Échec de la récupération de la liste deses données de la rapport"
        );
      }

      const { data } = await response.json();

      const updatedData = data.map((item) => ({
        ...item,
        date: new Date(item.date),
        users: {
          ...item.users,
          dob: new Date(item.users.dob),
          createdAt: new Date(item.users.createdAt),
          updatedAt: new Date(item.users.updatedAt),
        },
        member: {
          ...item.member,
          dob: new Date(item.member.dob),
          createdAt: new Date(item.member.createdAt),
          updatedAt: new Date(item.member.updatedAt),
        },
      }));

      return updatedData;
    },
  });
};

// === Query: Get one Emargement ===
export const useGetOneEmargement = (id: string) => {
  return useQuery({
    queryKey: [QueryKeyString.rapports + id],
    queryFn: async () => {
      const response = await client.api.rapport.emargement[":emId"].$get({
        param: { emId: id },
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
        Users: {
          ...data.users,
          dob: new Date(data.users.dob),
          createdAt: new Date(data.users.createdAt),
          updatedAt: new Date(data.users.updatedAt),
        },
        member: {
          ...data.member,
          dob: new Date(data.member.dob),
          createdAt: new Date(data.member.createdAt),
          updatedAt: new Date(data.member.updatedAt),
        },
      };
      return updatedData;
    },
  });
};

// === Mutation: Create Emargement ===
export const useCreateEmargement = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();
  const { data: user, updateFields } = useMyData();

  return useMutation<PostResponse, Error, PostRequest>({
    mutationFn: async ({ json }: PostRequest) => {
      const response = await client.api.rapport.emargement["$post"]({ json });

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
            emargements: [...((oldData?.emargements as any[]) ?? []), data],
          };
        }
      );

      updateFields({
        emargements: [
          //@ts-ignore
          ...(user?.emargements || []),
          //@ts-ignore
          data,
        ],
      });

      toast.success({
        message: "Les données de la map  a été enregistré avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.rapports],
      });
      close();
    },
    onError: (err) => {

      console.log({err})
      // close();

      toast.error({
        message: `Échec de la création  : ${err.message}`,
      });
    },
  });
};

// === Mutation: Update Emargement ===
export const useUpdateEmargement = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();
  const { data: user, updateFields } = useMyData();

  return useMutation<PatchResponse, Error, PatchRequest>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.rapport.emargement[":emId"]["$patch"]({
        json,
        param,
      });

      if (!res.ok) {
        const errorBody = await res.text();

        throw new Error(`Erreur API: ${res.status} - ${errorBody}`);
      }

      return await res.json();
    },
    onSuccess: ({ data }) => {
      if (!data) return;
      queryClient.setQueryData<any>(
        ["accompanist", data?.usersId!],
        (oldData: any) => {
          const emargements = oldData?.emargements ?? [];

          // Si un emargement avec le même id existe, on le met à jour
          const updatedEmargements = emargements.some(
            (e: any) => e.id === data.id
          )
            ? emargements.map((e: any) => (e.id === data.id ? data : e))
            : [...emargements, data]; // sinon on ajoute

          return {
            ...(oldData ?? {}),
            emargements: updatedEmargements,
          };
        }
      );

      updateFields({
        emargements: (() => {
          const emargements = user?.emargements ?? [];

          return emargements.some((e: any) => e.id === data.id)
            ? emargements.map((e: any) => (e.id === data.id ? data : e))
            : [...emargements, data];
        })(),
      });

      toast.success({
        message: "Les données de la map a été modifié avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.rapports],
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

// === Mutation: Delete Emargement ===
export const useDeleteEmargement = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, DeleteRequest>({
    mutationFn: async ({ param }) => {
      const res = await client.api.rapport.emargement[":emId"]["$delete"]({
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
        queryKey: [QueryKeyString.rapports],
      });
    },
    onError: (err) => {
      toast.error({
        message: `Erreur lors de la suppression : ${err.message}`,
      });
    },
  });
};
