import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/core/lib/rpc";
import { QueryKeyString } from "@/core/lib/constants";

import { useModal } from "@/core/providers/modal-provider";

import { toast } from "../components/global/custom-toast";
import { useMedia } from "@/core/hooks/store";

// === Type Inference ===
type PostResponse = InferResponseType<
  (typeof client.api.accompaniment)["$post"]
>;
type PostRequest = InferRequestType<(typeof client.api.accompaniment)["$post"]>;

type PatchResponse = InferResponseType<
  (typeof client.api.accompaniment)[":accId"]["$patch"],
  200
>;
type PatchRequest = InferRequestType<
  (typeof client.api.accompaniment)[":accId"]["$patch"]
>;

type PatchResMedia = InferResponseType<
  (typeof client.api.accompaniment.media)["$patch"],
  200
>;
type PatchReqMedia = InferRequestType<
  (typeof client.api.accompaniment.media)["$patch"]
>;

type DeleteResponse = InferResponseType<
  (typeof client.api.accompaniment)[":accId"]["$delete"],
  200
>;
type DeleteRequest = InferRequestType<
  (typeof client.api.accompaniment)[":accId"]["$delete"]
>;

type DeleteRes = InferResponseType<
  (typeof client.api.accompaniment.media)[":MId"]["$delete"],
  200
>;
type DeleteReq = InferRequestType<
  (typeof client.api.accompaniment.media)[":MId"]["$delete"]
>;

// === Query: Get accompaniment ===
export const useGetAccompaniments = () => {
  return useQuery({
    queryKey: [QueryKeyString.accompaniments],
    queryFn: async () => {
      const response = await client.api.accompaniment.$get();

      if (!response.ok) {
        throw new Error(
          "Échec de la récupération de la liste des accompagnementss"
        );
      }

      const { data } = await response.json();

      const updatedData = data.map((item) => ({
        ...item,
        st: item.status ? "Terminer" : "En cours",
        project: {
          ...item.project,
          startDate: new Date(item.project.startDate),
          endDate: new Date(item.project.endDate),
          createdAt: new Date(item.project.createdAt),
          updatedAt: new Date(item.project.updatedAt),
        },
        users: item.users
          ? {
              ...item.users,
              dob: new Date(item.users.dob),
              createdAt: new Date(item.users.createdAt),
              updatedAt: new Date(item.users.updatedAt),
            }
          : null,
        members: item.members?.map((m) => ({
          ...m,
          dob: new Date(m.dob),
          createdAt: new Date(m.createdAt),
          updatedAt: new Date(m.updatedAt),
        })),
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));

      return updatedData;
    },
  });
};

export const useGetOneAccompaniment = (id: string) => {
  return useQuery({
    queryKey: [QueryKeyString.accompaniments + id],
    queryFn: async () => {
      const response = await client.api.accompaniment[":accId"].$get({
        param: { accId: id },
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
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        users: data.users
          ? {
              ...data.users,
              createdAt: new Date(data.users.createdAt),
              updatedAt: new Date(data.users.updatedAt),
              dob: new Date(data.users.dob),
            }
          : null,
        planning: data.planning
          ? {
              ...data.planning,
              visit: data.planning.visit.map((v) => ({
                ...v,
                date: new Date(v.date),
              })),
              users: data.planning.users
                ? {
                    ...data.planning.users,
                    createdAt: new Date(data.planning.users.createdAt),
                    updatedAt: new Date(data.planning.users.updatedAt),
                    dob: new Date(data.planning.users.dob),
                  }
                : null,
            }
          : null,
        project: {
          ...data.project,
          startDate: new Date(data.project.startDate),
          endDate: new Date(data.project.endDate),
        },
        conflits: data.conflits.map((item) => ({
          ...item,
          users: {
            ...item.users,
            dob: new Date(item.users.dob),
            createdAt: new Date(item.users.createdAt),
            updatedAt: new Date(item.users.updatedAt),
          },

          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        })),
        rencontre: data.rencontre.map((item) => ({
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
        })),
        members: data.members.map((member) => ({
          ...member,
          emargements: member.emargements.map((e) => ({
            ...e,
            date: new Date(e.date),
          })),
          statut: member.leave ? "oui" : "non",
          createdAt: new Date(member.createdAt),
          updatedAt: new Date(member.updatedAt),
          dob: new Date(member.dob),
        })),
        map: data.map
          ? {
              ...data.map,
              createdAt: new Date(data.map.createdAt),
              updatedAt: new Date(data.map.updatedAt),
              accompaniment: {
                ...data.map.accompaniment,
                createdAt: new Date(data.map.accompaniment.createdAt),
                updatedAt: new Date(data.map.accompaniment.updatedAt),
                users: data.map.accompaniment.users
                  ? {
                      ...data.map.accompaniment.users,
                      createdAt: new Date(
                        data.map.accompaniment.users.createdAt
                      ),
                      updatedAt: new Date(
                        data.map.accompaniment.users.updatedAt
                      ),
                      dob: new Date(data.map.accompaniment.users.dob),
                    }
                  : null,
                members:
                  data.map.accompaniment.members?.map((member) => ({
                    ...member,
                    createdAt: new Date(member.createdAt),
                    updatedAt: new Date(member.updatedAt),
                    dob: new Date(member.dob),
                  })) ?? [],
              },
            }
          : null,
        purchases: data.purchases.map((p) => ({
          ...p,
          purchaseItems: p.purchaseItems.map((item) => ({
            ...item,
            date: new Date(item.date),
          })),
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
        })),
      };
      return updatedData;
    },
  });
};

export const useGetMyAccompaniments = (id: string, admin: string) => {
  return useQuery({
    queryKey: [QueryKeyString.accompaniments],
    queryFn: async () => {
      const response = await client.api.accompaniment.my[":id"][":admin"].$get({
        param: { id: id, admin: admin },
      });

      if (!response.ok) {
        throw new Error(
          "Échec de la récupération de la liste des accompagnementss"
        );
      }

      const { data } = await response.json();

      const updatedData = data.map((item) => ({
        ...item,
        st: item.status ? "Terminer" : "En cours",
        project: {
          ...item.project,
          startDate: new Date(item.project.startDate),
          endDate: new Date(item.project.endDate),
          createdAt: new Date(item.project.createdAt),
          updatedAt: new Date(item.project.updatedAt),
        },
        users: item.users
          ? {
              ...item.users,
              dob: new Date(item.users.dob),
              createdAt: new Date(item.users.createdAt),
              updatedAt: new Date(item.users.updatedAt),
            }
          : null,
        members: item.members?.map((m) => ({
          ...m,
          dob: new Date(m.dob),
          createdAt: new Date(m.createdAt),
          updatedAt: new Date(m.updatedAt),
        })),
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));

      return updatedData;
    },
  });
};

// === Mutation: Create accompaniment ===
export const useCreateAccompaniment = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();

  return useMutation<PostResponse, Error, PostRequest>({
    mutationFn: async ({ json }: PostRequest) => {
      const response = await client.api.accompaniment["$post"]({ json });

      if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(errorBody);
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success({
        message: "L'accompagnements  a été enregistré avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.accompaniments],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.Wmembers],
      });
      close();
    },
    onError: (err) => {
      // close();

      toast.error({
        message: `Échec de la création de l'accompagnements : ${err.message}`,
      });
    },
  });
};

// === Mutation: Update accompaniment ===
export const useUpdateAccompaniment = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();

  return useMutation<PatchResponse, Error, PatchRequest>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.accompaniment[":accId"]["$patch"]({
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
      toast.success({ message: "L'accompagnements a été modifié avec succès" });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.accompaniments],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.Wmembers],
      });
      close();
    },
    onError: (err) => {
      close();

      const parsedError = JSON.parse(err.message);

      toast.error({
        message: `Échec de la mise a jour de l'accompagnements : ${parsedError.message}`,
      });
    },
  });
};

// === Mutation: add Media to accompaniment ===
export const useAddMedia = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();
  const { setData } = useMedia();

  return useMutation<PatchResMedia, Error, PatchReqMedia>({
    mutationFn: async ({ json }) => {
      const res = await client.api.accompaniment.media["$patch"]({
        json,
      });

      if (!res.ok) {
        const errorBody = await res.text();

        throw new Error(`Erreur API: ${res.status} - ${errorBody}`);
      }

      return await res.json();
    },
    onSuccess: ({ data }) => {
      setData(data.media);
      toast.success({ message: "l'enregistrement effectué avec succès" });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.accompaniments],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.Wmembers],
      });
      close();
    },
    onError: (err) => {
      close();

      const parsedError = JSON.parse(err.message);

      toast.error({
        message: `Échec de l'enregistrement : ${parsedError.message}`,
      });
    },
  });
};

// === Mutation: remove Media to accompaniment ===
export const useRemoveMedia = () => {
  const queryClient = useQueryClient();
  const { removeData } = useMedia();

  return useMutation<DeleteRes, Error, DeleteReq>({
    mutationFn: async ({ param }) => {
      const res = await client.api.accompaniment.media[":MId"]["$delete"]({
        param,
      });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      return await res.json();
    },

    onSuccess: ({ data }) => {
      removeData(data);
      toast.success({
        message: "L'accompagnements a été supprimé avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.accompaniments],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.Wmembers],
      });
    },
    onError: (err) => {
      toast.error({
        message: `Erreur lors de la suppression : ${err.message}`,
      });
    },
  });
};
// === Mutation: Delete accompaniment ===
export const useDeletAccompaniment = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, DeleteRequest>({
    mutationFn: async ({ param }) => {
      const res = await client.api.accompaniment[":accId"]["$delete"]({
        param,
      });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      return await res.json();
    },

    onSuccess: () => {
      toast.success({
        message: "L'accompagnements a été supprimé avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.accompaniments],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.Wmembers],
      });
    },
    onError: (err) => {
      toast.error({
        message: `Erreur lors de la suppression : ${err.message}`,
      });
    },
  });
};
