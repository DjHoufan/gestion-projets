import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/core/lib/rpc";
import { QueryKeyString } from "@/core/lib/constants";

import { useModal } from "@/core/providers/modal-provider";

import { toast } from "../components/global/custom-toast";
import { Toaster } from "@/core/components/ui/sonner";
import { useMyData } from "@/core/hooks/store";

// === Type Inference ===
type PostResponse = InferResponseType<(typeof client.api.team)["$post"]>;
type PostRequest = InferRequestType<(typeof client.api.team)["$post"]>;

type PatchResponse = InferResponseType<
  (typeof client.api.team)[":teamId"]["$patch"],
  200
>;
type PatchRequest = InferRequestType<
  (typeof client.api.team)[":teamId"]["$patch"]
>;

type PatchRes = InferResponseType<
  (typeof client.api.team.updateProfilev1)[":id"][":newpassword"][":password"][":email"]["$patch"],
  200
>;
type PatchReq = InferRequestType<
  (typeof client.api.team.updateProfilev1)[":id"][":newpassword"][":password"][":email"]["$patch"]
>;

type PatchResProfile = InferResponseType<
  (typeof client.api.team.updateProfilev2)[":id"]["$patch"],
  200
>;
type PatchReqProfile = InferRequestType<
  (typeof client.api.team.updateProfilev2)[":id"]["$patch"]
>;

type PatchResProfileOrCV = InferResponseType<
  (typeof client.api.team.updateProfilev3)[":userId"][":value"][":op"]["$patch"],
  200
>;
type PatchReqProfileOrCv = InferRequestType<
  (typeof client.api.team.updateProfilev3)[":userId"][":value"][":op"]["$patch"]
>;

type DeleteResponse = InferResponseType<
  (typeof client.api.team)[":teamId"]["$delete"],
  200
>;
type DeleteRequest = InferRequestType<
  (typeof client.api.team)[":teamId"]["$delete"]
>;

type ResponseTypeAccess = InferResponseType<
  (typeof client.api.team)[":employeId"]["rolepermission"]["$patch"]
>;
type RequestTypeAccess = InferRequestType<
  (typeof client.api.team)[":employeId"]["rolepermission"]["$patch"]
>;

// === Query: Get team ===
export const useGetTeam = () => {
  return useQuery({
    queryKey: [QueryKeyString.team],
    queryFn: async () => {
      const response = await client.api.team.$get();

      if (!response.ok) {
        throw new Error(
          "Échec de la récupération de la liste des utilisateurs"
        );
      }

      const { data } = await response.json();

      const updatedData = data.map((item) => ({
        ...item,

        cv: item.cv ? item.cv : null,
        dob: new Date(item.dob),
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));

      return updatedData;
    },
  });
};

// === Query: Get Employe ===
export const useGetEmploye = () => {
  return useQuery({
    queryKey: [QueryKeyString.employes],
    queryFn: async () => {
      const response = await client.api.team.employe.$get();

      if (!response.ok) {
        throw new Error("Échec de la récupération de la liste des employes");
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

export const useUpdateAccessEmploye = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseTypeAccess, Error, RequestTypeAccess>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.team[":employeId"]["rolepermission"][
        "$patch"
      ]({
        json,
        param,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success({
        message: "L'accès de l'employé a été mis à jour avec succès",
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.employes] });
    },
    onError: () => {
      toast.error({ message: "L'enregistrement de l'employé a échoué" });
    },
  });

  return mutation;
};

export const useGetUsersNotInChat = (id: string) => {
  return useQuery({
    queryKey: [QueryKeyString.usersNotInChat],
    queryFn: async () => {
      const response = await client.api.team.users[":chatId"].$get({
        param: { chatId: id },
      });

      if (!response.ok) {
        throw new Error(
          "Échec de la récupération de la liste des utilisateurs"
        );
      }

      const { data } = await response.json();

      if (!data) {
        throw new Error("Aucun user trouvé.");
      }

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

export const useGetProfile = (id: string) => {
  return useQuery({
    queryKey: [QueryKeyString.profile],
    queryFn: async () => {
      const response = await client.api.team.profile[":teamId"].$get({
        param: { teamId: id },
      });

      if (!response.ok) {
        throw new Error(
          "Échec de la récupération de la liste des utilisateurs"
        );
      }

      const { data } = await response.json();

      if (!data) {
        throw new Error("Aucun user trouvé.");
      }

      const updatedData = {
        ...data,

        dob: new Date(data.dob),
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };

      return updatedData;
    },
  });
};

export const useGetOnTeam = (id: string) => {
  const { setData } = useMyData();
  return useQuery({
    queryKey: [QueryKeyString.Oneaccompanist + id],
    queryFn: async () => {
      const response = await client.api.team[":teamId"].$get({
        param: { teamId: id },
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

        conflit: data.conflit.map((c) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt),
        })),

        emargements: data.emargements.map((e) => ({
          ...e,
          date: new Date(e.date),
          member: {
            ...e.member,
            dob: new Date(e.member.dob),
            createdAt: new Date(e.member.createdAt),
            updatedAt: new Date(e.member.updatedAt),
          },
        })),

        plannings: data.plannings.map((p) => ({
          ...p,
          accompaniments: p.accompaniments.map((a) => ({
            ...a,
            createdAt: new Date(a.createdAt),
            updatedAt: new Date(a.updatedAt),
            members: a.members.map((m) => ({
              ...m,
              dob: new Date(m.dob),
              createdAt: new Date(m.createdAt),
              updatedAt: new Date(m.updatedAt),
            })),
          })),
          visit: p.visit.map((v) => ({
            ...v,
            date: new Date(v.date),
          })),
        })),

        rencontres: data.rencontres.map((r) => ({
          ...r,
         
          visit:{
            ...r.visit,
            date: new Date(r.visit.date),
          },

          signatures: r.signatures.map((s) => ({
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

        accompaniments: data.accompaniments.map((a) => ({
          ...a,
          name: a.name,
          map: a.map
            ? {
                ...a.map,
                createdAt: new Date(a.map.createdAt),
                updatedAt: new Date(a.map.updatedAt),
                accompaniment: {
                  ...a.map.accompaniment,
                  createdAt: new Date(a.map.accompaniment.createdAt),
                  updatedAt: new Date(a.map.accompaniment.updatedAt),
                  users: a.map.accompaniment.users
                    ? {
                        ...a.map.accompaniment.users,
                        createdAt: new Date(
                          a.map.accompaniment.users.createdAt
                        ),
                        updatedAt: new Date(
                          a.map.accompaniment.users.updatedAt
                        ),
                        dob: new Date(a.map.accompaniment.users.dob),
                      }
                    : null,
                  members:
                    a.map.accompaniment.members?.map((member) => ({
                      ...member,
                      createdAt: new Date(member.createdAt),
                      updatedAt: new Date(member.updatedAt),
                      dob: new Date(member.dob),
                    })) ?? [],
                },
              }
            : null,
          createdAt: new Date(a.createdAt),
          updatedAt: new Date(a.updatedAt),

          members: a.members.map((m) => ({
            ...m,
            dob: new Date(m.dob),
            createdAt: new Date(m.createdAt),
            updatedAt: new Date(m.updatedAt),
          })),
          conflits: a.conflits.map((c) => ({
            ...c,
            createdAt: new Date(c.createdAt),
            updatedAt: new Date(c.updatedAt),
          })),
          rencontre: a.rencontre.map((r) => ({
            ...r,
         
            signatures: r.signatures.map((s) => ({
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
          project: a.project && {
            ...a.project,
            startDate: new Date(a.project.startDate),
            endDate: new Date(a.project.endDate),
            createdAt: new Date(a.project.createdAt),
            updatedAt: new Date(a.project.updatedAt),
          },
          purchases: a.purchases.map((p) => ({
            ...p,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt),
            purchaseItems: p.purchaseItems?.map((i) => ({
              ...i,
              date: new Date(i.date),
            })),
          })),
          planning: a.planning && {
            ...a.planning,
            accompaniments: a.planning.accompaniments.map((pa) => ({
              ...pa,
              members: pa.members.map((m) => ({
                ...m,
                dob: new Date(m.dob),
                createdAt: new Date(m.createdAt),
                updatedAt: new Date(m.updatedAt),
              })),
              createdAt: new Date(pa.createdAt),
              updatedAt: new Date(pa.updatedAt),
            })),
            visit: a.planning.visit.map((v) => ({
              ...v,
              date: new Date(v.date),
            })),
          },
        })),
      };

      setData(updatedData);

      return updatedData;
    },
  });
};

// === Query: Get Trainers ===
export const useGetTrainers = () => {
  return useQuery({
    queryKey: [QueryKeyString.accompanist],
    queryFn: async () => {
      const response = await client.api.team.trainer.$get();

      if (!response.ok) {
        throw new Error("Échec de la récupération de la liste");
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

// === Query: Get accompanist ===
export const useGetAccompanist = () => {
  return useQuery({
    queryKey: [QueryKeyString.accompanist],
    queryFn: async () => {
      const response = await client.api.team.accompanist.$get();

      if (!response.ok) {
        throw new Error("Échec de la récupération de la liste");
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

// === Mutation: Create team ===
export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();

  return useMutation<PostResponse, Error, PostRequest>({
    mutationFn: async ({ json }: PostRequest) => {
      const response = await client.api.team["$post"]({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success({ message: "L'utilisateur  a été enregistré avec succès" });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.team] });
      close();
    },
    onError: (err) => {
      toast.error({
        message: `Échec de l'enregistrement de l'utilisateur : `,
      });
    },
  });
};

// === Mutation: Update team ===
export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();

  return useMutation<PatchResponse, Error, PatchRequest>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.team[":teamId"]["$patch"]({
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

// === Mutation: Update team ===
export const useUpdatePassword = () => {
  return useMutation<PatchRes, Error, PatchReq>({
    mutationFn: async ({ param }) => {
      const res = await client.api.team.updateProfilev1[":id"][":newpassword"][
        ":password"
      ][":email"]["$patch"]({
        param,
      });

      const result = await res.json();
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success({ message: "Mot de passe modifié avec succès" });
    },
    onError: (err) => {

      toast.error({
        message: `Erreur lors du changement de mot de passe : ${err.message}`,
      });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { updateFields } = useMyData();
  return useMutation<PatchResProfile, Error, PatchReqProfile>({
    mutationFn: async ({ param, json }) => {
      const res = await client.api.team.updateProfilev2[":id"]["$patch"]({
        param,
        json,
      });

      const result = await res.json();

      return result;
    },
    onSuccess: ({ data }) => {

      queryClient.setQueryData<any>(
        ["accompanist", data.id],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            name: data.name ?? oldData.name,
            email: data.email ?? oldData.email,
            address: data.address ?? oldData.address,
            dob: data.dob ?? oldData.dob,
            phone: data.phone ?? oldData.phone,
          };
        }
      );

      updateFields({
        name: data.name,
        phone: data.phone,
        address: data.address,
        dob: new Date(data.dob),
      });

      toast.success({ message: "le profil a été mis à jour" });
    },
    onError: (err) => {

      toast.error({
        message: `Erreur lors du changement de mot de passe : ${err.message}`,
      });
    },
  });
};

export const useUpdateCvOrProfile = () => {
  const queryClient = useQueryClient();
  const { updateFields } = useMyData();
  return useMutation<PatchResProfileOrCV, Error, PatchReqProfileOrCv>({
    mutationFn: async ({ param }) => {
      const res = await client.api.team.updateProfilev3[":userId"][":value"][
        ":op"
      ]["$patch"]({
        param,
      });

      const result = await res.json();

      return result;
    },
    onSuccess: ({ data }) => {

      queryClient.setQueryData<any>(
        ["accompanist", data.id],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            cv: data.cv ?? oldData.cv,
            name: data.name ?? oldData.name,
            email: data.email ?? oldData.email,
            address: data.address ?? oldData.address,
            dob: data.dob ?? oldData.dob,
            phone: data.phone ?? oldData.phone,
          };
        }
      );

      updateFields({
        profile: data.profile,
        cv: data.cv,
      });

      toast.success({ message: "le profil a été mis à jour" });
    },
    onError: (err) => {

      toast.error({
        message: `Erreur lors du changement de mot de passe : ${err.message}`,
      });
    },
  });
};

// === Mutation: Delete team ===
export const useDeletTeam = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, DeleteRequest>({
    mutationFn: async ({ param }) => {
      const res = await client.api.team[":teamId"]["$delete"]({ param });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      return await res.json();
    },

    onSuccess: () => {
      toast.success({ message: "L'utilisateur a été supprimé avec succès" });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.team] });
    },
    onError: (err) => {
      toast.error({
        message: `Erreur lors de la suppression : ${err.message}`,
      });
    },
  });
};
