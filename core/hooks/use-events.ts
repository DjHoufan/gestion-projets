import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/core/lib/rpc";
import { QueryKeyString } from "@/core/lib/constants";

import { useModal } from "@/core/providers/modal-provider";

import { toast } from "../components/global/custom-toast";

// === Type Inference ===
type PostResponse = InferResponseType<(typeof client.api.events)["$post"]>;
type PostRequest = InferRequestType<(typeof client.api.events)["$post"]>;

type PatchResponse = InferResponseType<
  (typeof client.api.events)[":eventId"]["$patch"],
  200
>;
type PatchRequest = InferRequestType<
  (typeof client.api.events)[":eventId"]["$patch"]
>;

type DeleteResponse = InferResponseType<
  (typeof client.api.events)[":eventId"]["$delete"],
  200
>;
type DeleteRequest = InferRequestType<
  (typeof client.api.events)[":eventId"]["$delete"]
>;

// === Query: Get event ===
export const useGetEvents = () => {
  return useQuery({
    queryKey: [QueryKeyString.events],
    queryFn: async () => {
      const response = await client.api.events.$get();

      if (!response.ok) {
        throw new Error("Échec de la récupération de la liste des évènements");
      }

      const { data } = await response.json();

      const updatedData = data.map((item) => ({
        ...item,

        date: new Date(item.date),
      }));

      return updatedData;
    },
  });
};

export const useGetOnEvent = (id: string) => {
  console.log({id});
  
  return useQuery({
    queryKey: [QueryKeyString.OneEvent],
    queryFn: async () => {
      const response = await client.api.events[":eventId"].$get({
        param: { eventId: id },
      });

      if (!response.ok) {
        throw new Error("Échec de la récupération de la liste de l'évènement");
      }

      const { data } = await response.json();

      if (!data) {
        throw new Error("Aucun user trouvé.");
      }

      const updatedData = {
        ...data,
        date: new Date(data.date),
      };

      return updatedData;
    },
  });
};

// === Mutation: Create event ===
export const useCreatEvent = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();

  return useMutation<PostResponse, Error, PostRequest>({
    mutationFn: async ({ json }: PostRequest) => {
      const response = await client.api.events["$post"]({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success({
        message: "L'évènement  a été enregistré avec succès",
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.events] });
      close();
    },
    onError: (err) => {
      toast.error({
        message: `Échec de l'enregistrement de l'évènement : ${err.message}`,
      });
    },
  });
};

// === Mutation: Update event ===
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();

  return useMutation<PatchResponse, Error, PatchRequest>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.events[":eventId"]["$patch"]({
        json,
        param,
      });

      return await res.json();
    },
    onSuccess: () => {
      toast.success({ message: "L'évènement a été modifié avec succès" });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.events] });
      close();
    },
    onError: (err) => {
      toast.error({
        message: `Échec de la modification de l'évènement : ${err.message}`,
      });
    },
  });
};

// === Mutation: Delete event ===
export const useDeletevent = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, DeleteRequest>({
    mutationFn: async ({ param }) => {
      const res = await client.api.events[":eventId"]["$delete"]({ param });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      return await res.json();
    },

    onSuccess: () => {
      toast.success({ message: "L'évènement a été supprimé avec succès" });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.events] });
    },
    onError: (err) => {
      toast.error({
        message: `Erreur lors de la suppression : ${err.message}`,
      });
    },
  });
};
