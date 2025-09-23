// core/lib/mutation-middleware.ts - Middleware pour les mutations optimisées
import { QueryClient } from "@tanstack/react-query";
import { toast } from "@/core/components/global/custom-toast";

export interface MutationConfig<TData, TVariables> {
  queryClient: QueryClient;
  queryKeys: {
    list: any[];
    detail?: (id: string) => any[];
  };
  messages: {
    success: string;
    error?: string;
  };
  optimisticUpdate?: {
    type: 'create' | 'update' | 'delete';
    getId: (variables: TVariables) => string;
  };
  onClose?: () => void;
}

// ✅ Factory pour mutations CRUD optimisées
export function createOptimisticMutation<TData extends { id: string }, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  config: MutationConfig<TData, TVariables>
) {
  return {
    mutationFn,

    onMutate: async (variables: TVariables) => {
      const { queryClient, queryKeys, optimisticUpdate } = config;

      if (!optimisticUpdate) return {};

      await queryClient.cancelQueries({ queryKey: queryKeys.list });

      const previousData = queryClient.getQueryData(queryKeys.list);
      const id = optimisticUpdate.getId(variables);

      switch (optimisticUpdate.type) {
        case 'create':
          const tempItem = {
            id: `temp-${Date.now()}`,
            ...variables,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as unknown as TData;

          queryClient.setQueryData(queryKeys.list, (old: TData[] = []) => [
            tempItem,
            ...old
          ]);
          break;

        case 'update':
          queryClient.setQueryData(queryKeys.list, (old: TData[] = []) =>
            old.map(item =>
              item.id === id
                ? { ...item, ...variables, updatedAt: new Date() }
                : item
            )
          );
          break;

        case 'delete':
          queryClient.setQueryData(queryKeys.list, (old: TData[] = []) =>
            old.filter(item => item.id !== id)
          );
          break;
      }

      return { previousData, tempId: `temp-${Date.now()}` };
    },

    onSuccess: (data: TData, variables: TVariables, context: any) => {
      const { queryClient, queryKeys, messages, onClose } = config;

      // ✅ Remplacer les données temporaires par les vraies
      if (context?.tempId) {
        queryClient.setQueryData(queryKeys.list, (old: TData[] = []) =>
          old.map(item =>
            item.id === context.tempId ? data : item
          )
        );
      }

      toast.success({ message: messages.success });
      onClose?.();
    },

    onError: (error: any, variables: TVariables, context: any) => {
      const { queryClient, queryKeys, messages } = config;

      // ✅ Rollback
      if (context?.previousData) {
        queryClient.setQueryData(queryKeys.list, context.previousData);
      }

      toast.error({
        message: messages.error || error.message || "Une erreur est survenue"
      });
    },

    onSettled: () => {
      const { queryClient, queryKeys } = config;
      queryClient.invalidateQueries({ queryKey: queryKeys.list });
    },
  };
}
