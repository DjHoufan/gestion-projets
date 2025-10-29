import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/core/lib/rpc";
import { QueryKeyString } from "@/core/lib/constants";

import { useModal } from "@/core/providers/modal-provider";

import { toast } from "@/core/components/global/custom-toast";
import { useMyData, usePlanningActions } from "@/core/hooks/store";
// import { useplannings } from "@/core/hooks/store";

// === Type Inference ===
type PostResponse = InferResponseType<
  (typeof client.api.planning)["$post"],
  200 // ✅ Spécifier le status code pour avoir accès à data
>;
type PostRequest = InferRequestType<(typeof client.api.planning)["$post"]>;

type PostResponseItem = InferResponseType<
  (typeof client.api.planning.visit)["$post"],
  200 // ✅ Spécifier le status code pour avoir accès à data
>;
type PostRequestItem = InferRequestType<
  (typeof client.api.planning.visit)["$post"]
>;

type PatchRes = InferResponseType<
  (typeof client.api.planning.visit)[":visitId"]["$patch"],
  200 // ✅ Spécifier le status code pour avoir accès à data
>;
type PatchReq = InferRequestType<
  (typeof client.api.planning.visit)[":visitId"]["$patch"]
>;

type PatchResponse = InferResponseType<
  (typeof client.api.planning)[":plangId"]["$patch"],
  200
>;
type PatchRequest = InferRequestType<
  (typeof client.api.planning)[":plangId"]["$patch"]
>;

type DeleteResponse = InferResponseType<
  (typeof client.api.planning)[":plangId"]["$delete"],
  200
>;
type DeleteRequest = InferRequestType<
  (typeof client.api.planning)[":plangId"]["$delete"]
>;

type ItemDeleteResponse = InferResponseType<
  (typeof client.api.planning)[":pItemId"]["visit"]["$delete"],
  200
>;
type ItemDeleteRequest = InferRequestType<
  (typeof client.api.planning)[":pItemId"]["visit"]["$delete"]
>;

type PatchResponseVisit = InferResponseType<
  (typeof client.api.planning)[":plangId"]["status"]["visit"]["$patch"],
  200
>;
type PatchRequestVisit = InferRequestType<
  (typeof client.api.planning)[":plangId"]["status"]["visit"]["$patch"]
>;

type VdeleteResponse = InferResponseType<
  (typeof client.api.planning.visit)[":visitId"]["$delete"],
  200
>;
type VdeleteRequest = InferRequestType<
  (typeof client.api.planning.visit)[":visitId"]["$delete"]
>;

// === Query: Get planning ===
export const useGetPlanning = () => {
  return useQuery({
    queryKey: [QueryKeyString.planning],
    staleTime: 3 * 60 * 1000, // 3 minutes - réduit les appels répétés
    gcTime: 30 * 60 * 1000, // 30 minutes - garde en cache
    queryFn: async () => {
      const response = await client.api.planning.$get();

      if (!response.ok) {
        throw new Error(
          "Échec de la récupération de la liste deses données de la planning"
        );
      }

      const { data } = await response.json();

      const updatedData = data.map((item) => ({
        ...item,
        visit: item.visit.map((visit) => ({
          ...visit,
          date: new Date(visit.date),
        })),
        accompaniments: item.accompaniments.map((accomp) => ({
          ...accomp,
          project: {
            ...accomp.project,
            startDate: new Date(accomp.project.startDate),
            endDate: new Date(accomp.project.endDate),
            createdAt: new Date(accomp.project.createdAt),
            updatedAt: new Date(accomp.project.updatedAt),
          },
          users: accomp.users
            ? {
                ...accomp.users,
                dob: new Date(accomp.users.dob),
                createdAt: new Date(accomp.users.createdAt),
                updatedAt: new Date(accomp.users.updatedAt),
              }
            : null,
          members:
            accomp.members?.map((m) => ({
              ...m,
              dob: new Date(m.dob),
              createdAt: new Date(m.createdAt),
              updatedAt: new Date(m.updatedAt),
            })) ?? [],
        })),
      }));

      return updatedData;
    },
  });
};

export const useGetMyPlanning = (id: string) => {
  return useQuery({
    queryKey: [QueryKeyString.planning, "my", id],
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    queryFn: async () => {
      const response = await client.api.planning.my[":plangId"].$get({
        param: { plangId: id },
      });

      if (!response.ok) {
        throw new Error(
          "Échec de la récupération de la liste deses données de la planning"
        );
      }

      const { data } = await response.json();

      const updatedData = data.map((item) => ({
        ...item,
        visit: item.visit.map((visit) => ({
          ...visit,
          date: new Date(visit.date),
        })),
        accompaniments: item.accompaniments.map((accomp) => ({
          ...accomp,
          project: {
            ...accomp.project,
            startDate: new Date(accomp.project.startDate),
            endDate: new Date(accomp.project.endDate),
            createdAt: new Date(accomp.project.createdAt),
            updatedAt: new Date(accomp.project.updatedAt),
          },
          users: accomp.users
            ? {
                ...accomp.users,
                dob: new Date(accomp.users.dob),
                createdAt: new Date(accomp.users.createdAt),
                updatedAt: new Date(accomp.users.updatedAt),
              }
            : null,
          members:
            accomp.members?.map((m) => ({
              ...m,
              dob: new Date(m.dob),
              createdAt: new Date(m.createdAt),
              updatedAt: new Date(m.updatedAt),
            })) ?? [],
        })),
      }));

      return updatedData;
    },
  });
};

export const useGetOnePlanning = (id: string) => {
  return useQuery({
    queryKey: [QueryKeyString.planning, "one", id],
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    queryFn: async () => {
      const response = await client.api.planning[":plangId"].$get({
        param: { plangId: id },
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
        visits: data.visit.map((visit) => ({
          ...visit,
          date: new Date(visit.date),
        })),
        accompaniments: data.accompaniments.map((accomp) => ({
          users: accomp.users
            ? {
                ...accomp.users,
                dob: new Date(accomp.users.dob),
                createdAt: new Date(accomp.users.createdAt),
                updatedAt: new Date(accomp.users.updatedAt),
              }
            : null,
          members:
            accomp.members?.map((m) => ({
              ...m,
              dob: new Date(m.dob),
              createdAt: new Date(m.createdAt),
              updatedAt: new Date(m.updatedAt),
            })) ?? [],
        })),
      };
      return updatedData;
    },
  });
};

// === Mutation: Create planning ===
export const useCreatePlanning = () => {
  const queryClient = useQueryClient();
  const { setPlanning } = usePlanningActions(); // ✅ Optimisé
  const { data: user, updateFields } = useMyData();
  const { close } = useModal();

  return useMutation<PostResponse, Error, PostRequest>({
    mutationFn: async ({ json }: PostRequest) => {
      const response = await client.api.planning["$post"]({ json });

      if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(errorBody);
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      const newdata = {
        ...data,
        visit: data.visit.map((v) => ({
          ...v,
          date: new Date(v.date),
        })),
        users: data.users
          ? {
              ...data.users,
              dob: new Date(data.users.dob),
              createdAt: new Date(data.users.createdAt),
              updatedAt: new Date(data.users.updatedAt),
            }
          : null,
      };
      setPlanning(newdata);

      queryClient.setQueryData<any>(
        ["accompanist", data?.usersId!],
        (oldData: any) => {
          return {
            ...(oldData ?? {}),
            plannings: [...((oldData?.plannings as any[]) ?? []), data],
          };
        }
      );

      updateFields({
        plannings: [
          //@ts-ignore
          ...(user?.plannings || []),
          //@ts-ignore
          newdata,
        ],
      });

      toast.success({
        message: "Le planning a été enregistré avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.planning],
      });
      close();
    },
    onError: (err) => {
      close();

      toast.error({
        message: `Échec de la création du planning : ${err.message}`,
      });
    },
  });
};

// === Mutation: Create visit ===
export const useCreatevisit = () => {
  const queryClient = useQueryClient();
  const { setPlanning } = usePlanningActions(); // ✅ Optimisé
  const { close } = useModal();
  const { data: user, updateFields } = useMyData();

  return useMutation<PostResponseItem, Error, PostRequestItem>({
    mutationFn: async ({ json }: PostRequestItem) => {
      const response = await client.api.planning.visit["$post"]({
        json,
      });

      if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(errorBody);
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      if (data) {
        const transformedData = {
          ...data,
          visit: data.visit.map((visit) => ({
            ...visit,
            date: new Date(visit.date),
          })),
          users: data.users
            ? {
                ...data.users,
                dob: new Date(data.users.dob),
                createdAt: new Date(data.users.createdAt),
                updatedAt: new Date(data.users.updatedAt),
              }
            : null,
        };

        setPlanning(transformedData);

        queryClient.setQueryData<any>(
          ["accompanist", transformedData.usersId],
          (oldData: any) => {
            return {
              ...(oldData ?? {}),
              plannings: (oldData?.plannings || []).map((planning: any) =>
                planning.id === transformedData.id // l'id du planning
                  ? {
                      ...planning,
                      visit: [
                        ...(planning.visit || []),
                        ...(transformedData.visit || []), // on concatène le tableau
                      ],
                    }
                  : planning
              ),
            };
          }
        );

        updateFields({
          plannings: (user?.plannings || []).map((planning) =>
            planning.id === transformedData.id
              ? {
                  ...planning,
                  visit: [
                    ...(planning.visit || []),
                    ...(transformedData.visit || []),
                  ],
                }
              : planning
          ),
        });
      }

      close();

      toast.success({
        message: "Le planning a été enregistré avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.planning],
      });
    },
    onError: (err) => {
      toast.error({
        message: `Échec de la création du planning : ${err.message}`,
      });
    },
  });
};

// === Mutation: Create visit ===
export const useUpdatevisit = () => {
  const queryClient = useQueryClient();
  const { updateVisit } = usePlanningActions(); // ✅ Optimisé
  const { close } = useModal();

  return useMutation<PatchRes, Error, PatchReq>({
    mutationFn: async ({ json, param }: PatchReq) => {
      const response = await client.api.planning.visit[":visitId"]["$patch"]({
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
      updateVisit({
        ...data,
        date: new Date(data.date),
      });

      close();

      toast.success({
        message: "Le planning a été enregistré avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.planning],
      });
    },
    onError: (err) => {
      toast.error({
        message: `Échec de la création du planning : ${err.message}`,
      });
    },
  });
};
// === Mutation: Update planning ===
export const useUpdatePlanning = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();

  return useMutation<PatchResponse, Error, PatchRequest>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.planning[":plangId"]["$patch"]({
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
        message: "Le planninga été modifié avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.planning, QueryKeyString.Wmembers],
      });
      close();
    },
    onError: (err) => {
      close();

      const parsedError = JSON.parse(err.message);

      toast.error({
        message: `Échec de la mise a jour du planning : ${parsedError.message}`,
      });
    },
  });
};

// === Mutation: Delete planning ===
export const useDeletPlanning = () => {
  const queryClient = useQueryClient();

  // const plannings = useplannings();

  return useMutation<DeleteResponse, Error, DeleteRequest>({
    mutationFn: async ({ param }) => {
      const res = await client.api.planning[":plangId"]["$delete"]({
        param,
      });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      return await res.json();
    },

    onSuccess: (data) => {
      // plannings.removeData(data.data.id);
      toast.success({
        message: "Le planninga été supprimé avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.planning],
      });
    },
    onError: (err) => {
      toast.error({
        message: `Erreur lors de la suppression : ${err.message}`,
      });
    },
  });
};

// === Mutation: Delete visit ===
export const useDeletvisit = () => {
  const queryClient = useQueryClient();

  // const plannings = useplannings();

  return useMutation<ItemDeleteResponse, Error, ItemDeleteRequest>({
    mutationFn: async ({ param }) => {
      const res = await client.api.planning[":pItemId"]["visit"]["$delete"]({
        param,
      });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      return await res.json();
    },

    onSuccess: (data) => {
      if (!data.data) {
        toast.error({
          message: "Aucun element trouvé",
        });
        return;
      }
      // const transformedData = {
      //   ...data.data,
      //   visits: data.data.visits.map((item) => ({
      //     ...item,
      //     date: new Date(item.date),
      //   })),
      //   createdAt: new Date(data.data.createdAt),
      //   updatedAt: new Date(data.data.updatedAt),
      // };
      // plannings.replace(transformedData);

      toast.success({
        message: "Le planninga été supprimé avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.planning],
      });
    },
    onError: (err) => {
      toast.error({
        message: `Erreur lors de la suppression : ${err.message}`,
      });
    },
  });
};

// === Mutation: Update status visit ===
export const useUpdateStatusVisit = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();
  const { updateVisit } = usePlanningActions(); // ✅ Optimisé
  const { data: user, updateFields } = useMyData();

  return useMutation<PatchResponseVisit, Error, PatchRequestVisit>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.planning[":plangId"]["status"]["visit"][
        "$patch"
      ]({
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
      updateVisit({
        ...data,
        date: new Date(data.date),
      });

      // Pour le queryClient
      queryClient.setQueryData<any>(
        ["accompanist", user?.id!],
        (oldData: any) => {
          return {
            ...(oldData ?? {}),
            plannings: (oldData?.plannings || []).map((planning: any) =>
              planning.id === data.planningId
                ? {
                    ...planning,
                    visit: (planning.visit || []).filter(
                      (v: any) => v.id !== data.id
                    ),
                  }
                : planning
            ),
          };
        }
      );

      // Pour updateFields
      updateFields({
        plannings: (user?.plannings || []).map((planning) =>
          planning.id === data.planningId
            ? {
                ...planning,
                visit: (planning.visit || []).filter((v) => v.id !== data.id),
              }
            : planning
        ),
      });

      toast.success({
        message: "Le créneau été modifié avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.planning, QueryKeyString.Wmembers],
      });
      close();
    },
    onError: (err) => {
      close();

      const parsedError = JSON.parse(err.message);

      toast.error({
        message: `Échec de la mise a jour du créneau : ${parsedError.message}`,
      });
    },
  });
};

// === Mutation: Update status visit ===
export const useDeleteOneVisit = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();
  const { updateVisit } = usePlanningActions(); // ✅ Optimisé

  return useMutation<PatchResponseVisit, Error, PatchRequestVisit>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.planning[":plangId"]["status"]["visit"][
        "$patch"
      ]({
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
      updateVisit({
        ...data,
        date: new Date(data.date),
      });

      toast.success({
        message: "Le créneau été modifié avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.planning, QueryKeyString.Wmembers],
      });
      close();
    },
    onError: (err) => {
      close();

      const parsedError = JSON.parse(err.message);

      toast.error({
        message: `Échec de la mise a jour du créneau : ${parsedError.message}`,
      });
    },
  });
};

export const useDeleteVisits = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();
  const { removeVisit } = usePlanningActions(); // ✅ Optimisé

  return useMutation<VdeleteResponse, Error, VdeleteRequest>({
    mutationFn: async ({ param }) => {
      const res = await client.api.planning.visit[":visitId"]["$delete"]({
        param,
      });

      if (!res.ok) {
        const errorBody = await res.text();

        throw new Error(`Erreur API: ${res.status} - ${errorBody}`);
      }

      return await res.json();
    },
    onSuccess: ({ data }) => {
      removeVisit(data.id);

      toast.success({
        message: "Le créneau été supprimer avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.planning, QueryKeyString.Wmembers],
      });
      close();
    },
    onError: (error: any) => {
      // Vérifie si c'est une erreur API avec un body JSON
      let errorMessage =
        "Échec de la mise à jour du créneau, veuillez réessayer.";

      try {
        if (error instanceof Error) {
          // Si ton hook met directement le body dans error.message
          const parsed = JSON.parse(
            error.message.replace("Erreur API: 409 - ", "")
          );
          if (parsed?.error) {
            errorMessage = parsed.error;
          }
        } else if (error?.response?.data?.error) {
          // Si ça vient d'Axios / fetch avec réponse structurée
          errorMessage = error.response.data.error;
        }
      } catch {
        // si parsing échoue → garde le message par défaut
      }

      toast.error({
        message: errorMessage,
      });

      close();
    },
  });
};
