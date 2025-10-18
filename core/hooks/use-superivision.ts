import { toast } from "@/core/components/global/custom-toast";
import { QueryKeyString } from "@/core/lib/constants";
import { client } from "@/core/lib/rpc";
import { useModal } from "@/core/providers/modal-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

export const UsGetDataForSuperviseur = (id: string) => {
  return useQuery({
    queryKey: [QueryKeyString.superviseur],
    queryFn: async () => {
      const response = await client.api.superviseur[":supId"].$get({
        param: { supId: id },
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
        dob: new Date(data.dob),
        supervision: data.supervision.map((sup) => ({
          ...sup,
          createdAt: new Date(sup.createdAt),
          updatedAt: new Date(sup.updatedAt),
          dob: new Date(sup.dob),
          accompaniments: sup.accompaniments.map((item) => ({
            ...item,
            file: item.file,
            users: item.users
              ? {
                  ...item.users,
                  createdAt: new Date(item.users.createdAt),
                  updatedAt: new Date(item.users.updatedAt),
                  dob: new Date(item.users.dob),
                }
              : null,

            planning: item.planning
              ? {
                  ...item.planning,
                  visit: item.planning.visit.map((v) => ({
                    ...v,
                    date: new Date(v.date),
                  })),
                  users: item.planning.users
                    ? {
                        ...item.planning.users,
                        createdAt: new Date(item.planning.users.createdAt),
                        updatedAt: new Date(item.planning.users.updatedAt),
                        dob: new Date(item.planning.users.dob),
                      }
                    : null,
                }
              : null,

            project: item.project
              ? {
                  ...item.project,
                  startDate: new Date(item.project.startDate),
                  endDate: new Date(item.project.endDate),
                }
              : null,

            conflits: item.conflits.map((c) => ({
              ...c,
              users: c.users
                ? {
                    ...c.users,
                    dob: new Date(c.users.dob),
                    createdAt: new Date(c.users.createdAt),
                    updatedAt: new Date(c.users.updatedAt),
                  }
                : null,
              createdAt: new Date(c.createdAt),
              updatedAt: new Date(c.updatedAt),
            })),

            rencontre: item.rencontre.map((r) => ({
              ...r,
              visit: r.visit
                ? {
                    ...r.visit,
                    date: new Date(r.visit.date),
                  }
                : null,
              users: r.users
                ? {
                    ...r.users,
                    dob: new Date(r.users.dob),
                    createdAt: new Date(r.users.createdAt),
                    updatedAt: new Date(r.users.updatedAt),
                  }
                : null,
              signatures: r.signatures.map((s) => ({
                ...s,
                date: new Date(s.date),
                member: s.member
                  ? {
                      ...s.member,
                      dob: new Date(s.member.dob),
                      createdAt: new Date(s.member.createdAt),
                      updatedAt: new Date(s.member.updatedAt),
                    }
                  : null,
              })),
            })),

            members: item.members.map((member) => ({
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

            map: item.map
              ? {
                  ...item.map,
                  createdAt: new Date(item.map.createdAt),
                  updatedAt: new Date(item.map.updatedAt),
                  accompaniment: item.map.accompaniment
                    ? {
                        ...item.map.accompaniment,
                        createdAt: new Date(item.map.accompaniment.createdAt),
                        updatedAt: new Date(item.map.accompaniment.updatedAt),
                        users: item.map.accompaniment.users
                          ? {
                              ...item.map.accompaniment.users,
                              createdAt: new Date(
                                item.map.accompaniment.users.createdAt
                              ),
                              updatedAt: new Date(
                                item.map.accompaniment.users.updatedAt
                              ),
                              dob: new Date(item.map.accompaniment.users.dob),
                            }
                          : null,
                        members:
                          item.map.accompaniment.members?.map((member) => ({
                            ...member,
                            createdAt: new Date(member.createdAt),
                            updatedAt: new Date(member.updatedAt),
                            dob: new Date(member.dob),
                          })) ?? [],
                      }
                    : null,
                }
              : null,

            purchases: item.purchases.map((p) => ({
              ...p,
              purchaseItems: p.purchaseItems.map((pi) => ({
                ...pi,
                date: new Date(pi.date),
              })),
              createdAt: new Date(p.createdAt),
              updatedAt: new Date(p.updatedAt),
            })),
          })),
        })),
      };
      return updatedData;
    },
  });
};

export const useGetSignalement = () => {
  return useQuery({
    queryKey: [QueryKeyString.signelements],
    queryFn: async () => {
      const response = await client.api.superviseur.$get();

      if (!response.ok) {
        throw new Error(
          "Échec de la récupération de la liste des utilisateurs"
        );
      }

      const { data } = await response.json();

      const updatedData = data.map((item) => ({
        ...item,
        groupe: {
          ...item.groupe,
          createdAt: new Date(item.groupe.createdAt),
          updatedAt: new Date(item.groupe.updatedAt),
        },
        user: {
          ...item.user,
          dob: new Date(item.user.dob),
          createdAt: new Date(item.user.createdAt),
          updatedAt: new Date(item.user.updatedAt),
        },
        date: new Date(item.date),
      }));

      return updatedData;
    },
  });
};

export const useGetMySignalement = (id: string) => {
  return useQuery({
    queryKey: [QueryKeyString.signelements + id],
    queryFn: async () => {
      const response = await client.api.superviseur.mySignalement[":id"].$get({
        param: { id: id },
      });

      if (!response.ok) {
        throw new Error(
          "Échec de la récupération de la liste des utilisateurs"
        );
      }

      const { data } = await response.json();

      const updatedData = data.map((item) => ({
        ...item,
        groupe: {
          ...item.groupe,
          createdAt: new Date(item.groupe.createdAt),
          updatedAt: new Date(item.groupe.updatedAt),
        },
        user: {
          ...item.user,
          dob: new Date(item.user.dob),
          createdAt: new Date(item.user.createdAt),
          updatedAt: new Date(item.user.updatedAt),
        },
        date: new Date(item.date),
      }));

      return updatedData;
    },
  });
};

// === Type Inference ===
type PostResponse = InferResponseType<(typeof client.api.superviseur)["$post"]>;
type PostRequest = InferRequestType<(typeof client.api.superviseur)["$post"]>;

// === Mutation: Create Signalement ===
export const useCreateSignalement = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();

  return useMutation<PostResponse, Error, PostRequest>({
    mutationFn: async ({ json }: PostRequest) => {
      const response = await client.api.superviseur["$post"]({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success({ message: "L'utilisateur  a été enregistré avec succès" });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.signelements],
      });
      close();
    },
    onError: (err) => {
      toast.error({
        message: `Échec de l'enregistrement de l'utilisateur : `,
      });
    },
  });
};

type PatchResponse = InferResponseType<
  (typeof client.api.superviseur)[":id"]["$patch"],
  200
>;
type PatchRequest = InferRequestType<
  (typeof client.api.superviseur)[":id"]["$patch"]
>;

// === Mutation: Update  ===
export const useUpdateSignalement = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();

  return useMutation<PatchResponse, Error, PatchRequest>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.superviseur[":id"]["$patch"]({
        json,
        param,
      });

      return await res.json();
    },
    onSuccess: () => {
      toast.success({ message: "L'utilisateur a été modifié avec succès" });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.team] });
      close();
    },
    onError: (err) => {
      toast.error({
        message: `Échec de la modification de l'utilisateur : ${err.message}`,
      });
    },
  });
};

type PatchResStatus = InferResponseType<
  (typeof client.api.superviseur)[":id"][":statut"]["$patch"],
  200
>;
type PatchReqStatus = InferRequestType<
  (typeof client.api.superviseur)[":id"][":statut"]["$patch"]
>;

// === Mutation: Update  ===
export const useUpdateStatusSignalement = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();

  return useMutation<PatchResStatus, Error, PatchReqStatus>({
    mutationFn: async ({ param }) => {
      const res = await client.api.superviseur[":id"][":statut"]["$patch"]({
        param,
      });

      return await res.json();
    },
    onSuccess: () => {
      toast.success({ message: "Le statut a été modifié avec succès" });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.signelements] });
      close();
    },
    onError: (err) => {
      toast.error({
        message: `Échec de la modification : ${err.message}`,
      });
    },
  });
};
