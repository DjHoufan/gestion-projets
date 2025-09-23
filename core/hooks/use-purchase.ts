import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/core/lib/rpc";
import { QueryKeyString } from "@/core/lib/constants";

import { useModal } from "@/core/providers/modal-provider";

import { toast } from "@/core/components/global/custom-toast";
import { useMyData, usePurchases } from "@/core/hooks/store";
import { acceleratedValues } from "framer-motion";

// === Type Inference ===
type PostResponse = InferResponseType<(typeof client.api.purchase)["$post"]>;
type PostRequest = InferRequestType<(typeof client.api.purchase)["$post"]>;

type PostResponseItem = InferResponseType<
  (typeof client.api.purchase.purchaseItem)["$post"]
>;
type PostRequestItem = InferRequestType<
  (typeof client.api.purchase.purchaseItem)["$post"]
>;

type PatchResponse = InferResponseType<
  (typeof client.api.purchase)[":pId"]["$patch"],
  200
>;
type PatchRequest = InferRequestType<
  (typeof client.api.purchase)[":pId"]["$patch"]
>;

type DeleteResponse = InferResponseType<
  (typeof client.api.purchase)[":pId"]["$delete"],
  200
>;
type DeleteRequest = InferRequestType<
  (typeof client.api.purchase)[":pId"]["$delete"]
>;

type ItemDeleteResponse = InferResponseType<
  (typeof client.api.purchase)[":pItemId"]["purchaseItem"]["$delete"],
  200
>;
type ItemDeleteRequest = InferRequestType<
  (typeof client.api.purchase)[":pItemId"]["purchaseItem"]["$delete"]
>;

// === Query: Get purchase ===
export const useGetPurchase = () => {
  return useQuery({
    queryKey: [QueryKeyString.purchase],
    queryFn: async () => {
      const response = await client.api.purchase.$get();

      if (!response.ok) {
        throw new Error(
          "Échec de la récupération de la liste deses données de la purchase"
        );
      }

      const { data } = await response.json();

      const updatedData = data.map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));

      return updatedData;
    },
  });
};

export const useGetOnePurchase = (id: string) => {
  return useQuery({
    queryKey: [QueryKeyString.purchase + id],
    queryFn: async () => {
      const response = await client.api.purchase[":pId"].$get({
        param: { pId: id },
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
      };
      return updatedData;
    },
  });
};

// === Mutation: Create purchase ===
export const useCreatePurchase = () => {
  const queryClient = useQueryClient();
  const purchases = usePurchases();

  // purchases.setData(data?.purchases || []);
  const { close } = useModal();
  const { data: user, updateFields } = useMyData();

  return useMutation<PostResponse, Error, PostRequest>({
    mutationFn: async ({ json }: PostRequest) => {
      const response = await client.api.purchase["$post"]({ json });

      if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(errorBody);
      }

      return await response.json();
    },
    onSuccess: (data) => {
      const transformedData = {
        ...data.data,
        purchaseItems: data.data.purchaseItems.map((item) => ({
          ...item,
          date: new Date(item.date),
        })),
        createdAt: new Date(data.data.createdAt),
        updatedAt: new Date(data.data.updatedAt),
      };
      purchases.addData(transformedData);
      // Pour le queryClient
      queryClient.setQueryData<any>(
        ["accompanist", user?.id!],
        (oldData: any) => {
          return {
            ...(oldData ?? {}),
            accompaniments: (oldData?.accompaniments || []).map(
              (accompaniment: any) =>
                accompaniment.id === transformedData.accompanimentId
                  ? {
                      ...accompaniment,
                      purchases: (accompaniment.purchases || []).map(
                        (purchase: any) =>
                          purchase.id === transformedData.id
                            ? {
                                ...purchase,
                                ...transformedData, // maj total, updatedAt, etc.
                                purchaseItems: [
                                  // on enlève les doublons (par id)
                                  ...(purchase.purchaseItems || []).filter(
                                    (item: any) =>
                                      !transformedData.purchaseItems.some(
                                        (newItem) => newItem.id === item.id
                                      )
                                  ),
                                  // on ajoute les nouveaux
                                  ...transformedData.purchaseItems,
                                ],
                              }
                            : purchase
                      ),
                    }
                  : accompaniment
            ),
          };
        }
      );
      

      console.log({transformedData})

      console.log({acceleratedValues: user?.accompaniments });

      // Pour updateFields
      updateFields({
        accompaniments: (user?.accompaniments || []).map((accompaniment) =>
          accompaniment.id === transformedData.accompanimentId
            ? {
                ...accompaniment,
                purchases: (accompaniment.purchases || []).map((purchase) =>
                  purchase.id === transformedData.id
                    ? {
                        ...purchase,
                        ...transformedData,
                        purchaseItems: [
                          ...(purchase.purchaseItems || []).filter(
                            (item) =>
                              !transformedData.purchaseItems.some(
                                (newItem) => newItem.id === item.id
                              )
                          ),
                          ...transformedData.purchaseItems,
                        ],
                      }
                    : purchase
                ),
              }
            : accompaniment
        ),
      });

      toast.success({
        message: "L'achat  a été enregistré avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.purchase, QueryKeyString.purchase],
      });
      close();
    },
    onError: (err) => {
      close();

      toast.error({
        message: `Échec de la création de l'achat : ${err.message}`,
      });
    },
  });
};

// === Mutation: Create purchaseItem ===
export const useCreatePurchaseItem = () => {
  const queryClient = useQueryClient();
  const purchases = usePurchases();

  return useMutation<PostResponseItem, Error, PostRequestItem>({
    mutationFn: async ({ json }: PostRequestItem) => {
      const response = await client.api.purchase.purchaseItem["$post"]({
        json,
      });

      if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(errorBody);
      }

      return await response.json();
    },
    onSuccess: (data) => {
      const transformedData = {
        ...data.data,
        purchaseItems: data.data.purchaseItems.map((item) => ({
          ...item,
          date: new Date(item.date),
        })),
        createdAt: new Date(data.data.createdAt),
        updatedAt: new Date(data.data.updatedAt),
      };
      purchases.replace(transformedData);

      toast.success({
        message: "L'achat  a été enregistré avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.purchase, QueryKeyString.purchase],
      });
    },
    onError: (err) => {
      toast.error({
        message: `Échec de la création de l'achat : ${err.message}`,
      });
    },
  });
};

// === Mutation: Update purchase ===
export const useUpdatePurchase = () => {
  const queryClient = useQueryClient();
  const { close } = useModal();

  return useMutation<PatchResponse, Error, PatchRequest>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.purchase[":pId"]["$patch"]({
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
        message: "L'achat a été modifié avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.purchase, QueryKeyString.Wmembers],
      });
      close();
    },
    onError: (err) => {
      close();

      const parsedError = JSON.parse(err.message);

      toast.error({
        message: `Échec de la mise a jour de l'achat : ${parsedError.message}`,
      });
    },
  });
};

// === Mutation: Delete purchase ===
export const useDeletPurchase = () => {
  const queryClient = useQueryClient();

  const purchases = usePurchases();

  return useMutation<DeleteResponse, Error, DeleteRequest>({
    mutationFn: async ({ param }) => {
      const res = await client.api.purchase[":pId"]["$delete"]({
        param,
      });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      return await res.json();
    },

    onSuccess: (data) => {
      purchases.removeData(data.data.id);
      toast.success({
        message: "L'achat a été supprimé avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.purchase],
      });
    },
    onError: (err) => {
      toast.error({
        message: `Erreur lors de la suppression : ${err.message}`,
      });
    },
  });
};

// === Mutation: Delete purchaseItem ===
export const useDeletPurchaseItem = () => {
  const queryClient = useQueryClient();

  const purchases = usePurchases();

  return useMutation<ItemDeleteResponse, Error, ItemDeleteRequest>({
    mutationFn: async ({ param }) => {
      const res = await client.api.purchase[":pItemId"]["purchaseItem"][
        "$delete"
      ]({
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
      const transformedData = {
        ...data.data,
        purchaseItems: data.data.purchaseItems.map((item) => ({
          ...item,
          date: new Date(item.date),
        })),
        createdAt: new Date(data.data.createdAt),
        updatedAt: new Date(data.data.updatedAt),
      };
      purchases.replace(transformedData);

      toast.success({
        message: "L'achat a été supprimé avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyString.purchase],
      });
    },
    onError: (err) => {
      toast.error({
        message: `Erreur lors de la suppression : ${err.message}`,
      });
    },
  });
};
