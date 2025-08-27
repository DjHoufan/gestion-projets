import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/core/lib/rpc";
import { QueryKeyString } from "@/core/lib/constants";

import { useModal } from "@/core/providers/modal-provider";

import { toast } from "../components/global/custom-toast";
import { Prisma } from "@prisma/client";
import { handleMemberError } from "@/core/view/member/error";
import { useClasseMembers } from "@/core/hooks/store";

// === Type Inference ===
type PostResponse = InferResponseType<(typeof client.api.member)["$post"]>;
type PostRequest = InferRequestType<(typeof client.api.member)["$post"]>;

type PatchResponse = InferResponseType<
  (typeof client.api.member)[":emId"]["$patch"],
  200
>;
type PatchRequest = InferRequestType<
  (typeof client.api.member)[":emId"]["$patch"]
>;

type DeleteResponse = InferResponseType<
  (typeof client.api.member)[":emId"]["$delete"],
  200
>;
type DeleteRequest = InferRequestType<
  (typeof client.api.member)[":emId"]["$delete"]
>;

// === Query: Get member ===
export const useGetMembers = (enabled: boolean = true) => {
  return useQuery({
    queryKey: [QueryKeyString.members],
    queryFn: async () => {
      const response = await client.api.member.$get();

      if (!response.ok) {
        throw new Error(
          "Échec de la récupération de la liste des utilisateurs"
        );
      }

      const { data } = await response.json();

      const updatedData = data.map((item) => ({
        ...item,
        statut: item.leave ? "oui" : "non",
        leave: item.leave
          ? {
              ...item.leave,
              date: new Date(item.leave.date),
              createdAt: new Date(item.leave.createdAt),
              updatedAt: new Date(item.leave.updatedAt),
            }
          : null,
        dob: new Date(item.dob),
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));

      return updatedData;
    },
    enabled,
  });
};

export const useGetOnEmember = (id: string) => {
  return useQuery({
    queryKey: [QueryKeyString.members + id],
    queryFn: async () => {
      const response = await client.api.member[":emId"].$get({
        param: { emId: id },
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
        accompaniment: data.accompaniment
          ? {
              ...data.accompaniment,
              project: {
                ...data.accompaniment.project,
                startDate: new Date(data.accompaniment.project.startDate),
                endDate: new Date(data.accompaniment.project.endDate),
                createdAt: new Date(data.accompaniment.project.createdAt),
                updatedAt: new Date(data.accompaniment.project.updatedAt),
              },
              users: {
                ...data.accompaniment.users,
                createdAt: new Date(data.accompaniment.users.createdAt),
                updatedAt: new Date(data.accompaniment.users.updatedAt),
                dob: new Date(data.accompaniment.users.dob),
              },

              purchases: data.accompaniment.purchases.map((p) => ({
                ...p,
                purchaseItems: p.purchaseItems.map((ps) => ({
                  ...ps,
                  date: new Date(ps.date),
                })),
                createdAt: new Date(p.createdAt),
                updatedAt: new Date(p.updatedAt),
              })),

              planning: {
                ...data.accompaniment.planning,
                visit: data.accompaniment.planning?.visit.map((v) => ({
                  ...v,
                  date: new Date(v.date),
                })),
              },

              map:
                data.accompaniment.map && data.accompaniment.map.accompaniment
                  ? {
                      ...data.accompaniment.map,
                      createdAt: new Date(data.accompaniment.map.createdAt),
                      updatedAt: new Date(data.accompaniment.map.updatedAt),

                      accompaniment: {
                        ...data.accompaniment.map.accompaniment,
                        createdAt: new Date(
                          data.accompaniment.map.accompaniment.createdAt
                        ),
                        updatedAt: new Date(
                          data.accompaniment.map.accompaniment.updatedAt
                        ),
                        users: {
                          ...data.accompaniment.map.accompaniment.users,
                          createdAt: new Date(
                            data.accompaniment.map.accompaniment.users.createdAt
                          ),
                          updatedAt: new Date(
                            data.accompaniment.map.accompaniment.users.updatedAt
                          ),
                          dob: new Date(
                            data.accompaniment.map.accompaniment.users.dob
                          ),
                        },
                        members:
                          data.accompaniment.map.accompaniment.members.map(
                            (member) => ({
                              ...member,
                              createdAt: new Date(member.createdAt),
                              updatedAt: new Date(member.updatedAt),
                              dob: new Date(member.dob),
                            })
                          ),
                      },
                    }
                  : null,
            }
          : null,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };

      return updatedData;
    },
  });
};

export const useGetMembersWithoutGroup = (excludeIds: string[] = []) => {
  return useQuery({
    queryKey: [QueryKeyString.Wmembers],
    queryFn: async () => {
      const params = new URLSearchParams();
      excludeIds.forEach((id) => params.append("excludeIds", id));

      const queryParams = excludeIds.length > 0 ? { excludeIds } : {};

      const response = await client.api.member.withoutgroup.$get({
        query: queryParams,
      });

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

// === Mutation: Create member ===
export const useCreateMember = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();
  const { addData } = useClasseMembers();

  return useMutation<PostResponse, Error, PostRequest>({
    mutationFn: async ({ json }: PostRequest) => {
      const response = await client.api.member["$post"]({ json });

      if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(errorBody);
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      const updataData = {
        ...data,
        statut: data.leave ? "oui" : "non",
        leave: data.leave
          ? {
              ...data.leave,
              date: new Date(data.leave.date),
              createdAt: new Date(data.leave.createdAt),
              updatedAt: new Date(data.leave.updatedAt),
            }
          : null,
        dob: new Date(data.dob),
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };

      addData(updataData);
      toast.success({ message: "L'utilisateur  a été enregistré avec succès" });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.members] });
      close();
    },
    onError: (err) => {
      handleMemberError(err);
    },
  });
};

// === Mutation: Update member ===
export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();
  const { replace, removeData } = useClasseMembers();

  return useMutation<PatchResponse, Error, PatchRequest>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.member[":emId"]["$patch"]({
        json,
        param,
      });

      if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(errorBody);
      }

      return await response.json();
    },
    onSuccess: ({ data, projectId }) => {
      const updataData = {
        ...data,
        statut: data.leave ? "oui" : "non",
        leave: data.leave
          ? {
              ...data.leave,
              date: new Date(data.leave.date),
              createdAt: new Date(data.leave.createdAt),
              updatedAt: new Date(data.leave.updatedAt),
            }
          : null,
        dob: new Date(data.dob),
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };

      if (projectId === updataData.projectId) {
        replace(updataData);
      } else {
        removeData(updataData.id);
      }

      toast.success({ message: "L'utilisateur a été modifié avec succès" });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.members] });
      close();
    },
    onError: (err) => {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        let target: string | undefined;
        if (Array.isArray(err.meta?.target)) {
          target = err.meta?.target[0];
        }

        let message = "Un champ unique est déjà utilisé.";
        if (target === "email") {
          message = "L'adresse email est déjà utilisée par un autre membre.";
        } else if (target === "phone") {
          message =
            "Le numéro de téléphone est déjà utilisé par un autre membre.";
        }

        toast.error({ message });
      } else {
        // Fallback pour autres types d'erreurs
        toast.error({
          message: `Échec de la modification de l'utilisateur : ${err.message}`,
        });
      }
    },
  });
};

// === Mutation: Delete member ===
export const useDeletMember = () => {
  const queryClient = useQueryClient();
  const { removeData } = useClasseMembers();

  return useMutation<DeleteResponse, Error, DeleteRequest>({
    mutationFn: async ({ param }) => {
      const res = await client.api.member[":emId"]["$delete"]({ param });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      return await res.json();
    },

    onSuccess: ({ data }) => {
      removeData(data.id);
      toast.success({
        message: `L'utilisateur ${data.name} a été supprimé avec succès`,
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.members] });
    },
    onError: (err) => {
      toast.error({
        message: `Erreur lors de la suppression : ${err.message}`,
      });
    },
  });
};
