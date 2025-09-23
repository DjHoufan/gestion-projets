// core/lib/query-utils.ts - Utilitaires pour le cache optimisé
import { QueryClient } from "@tanstack/react-query";

// ✅ Fonction pour mise à jour optimiste générique
export function optimisticUpdate<T extends { id: string }>(
  queryClient: QueryClient,
  queryKey: any[],
  id: string,
  updateFn: (item: T) => T
) {
  queryClient.setQueryData(queryKey, (old: T[] = []) =>
    old.map(item => item.id === id ? updateFn(item) : item)
  );
}

// ✅ Fonction pour ajout optimiste
export function optimisticAdd<T extends { id: string }>(
  queryClient: QueryClient,
  queryKey: any[],
  newItem: T,
  position: 'start' | 'end' = 'start'
) {
  queryClient.setQueryData(queryKey, (old: T[] = []) =>
    position === 'start' ? [newItem, ...old] : [...old, newItem]
  );
}

// ✅ Fonction pour suppression optimiste
export function optimisticRemove<T extends { id: string }>(
  queryClient: QueryClient,
  queryKey: any[],
  id: string
) {
  queryClient.setQueryData(queryKey, (old: T[] = []) =>
    old.filter(item => item.id !== id)
  );
}

// ✅ Invalidation intelligente
export function smartInvalidate(
  queryClient: QueryClient,
  patterns: string[]
) {
  patterns.forEach(pattern => {
    queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey.some(key =>
          typeof key === 'string' && key.includes(pattern)
        ),
    });
  });
}

// ✅ Prefetch conditionnel
export function conditionalPrefetch<T>(
  queryClient: QueryClient,
  queryKey: any[],
  queryFn: () => Promise<T>,
  condition: boolean,
  staleTime = 5 * 60 * 1000
) {
  if (condition && !queryClient.getQueryData(queryKey)) {
    queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime,
    });
  }
}

// ✅ Factory pour les query keys optimisés
export const createQueryKeys = <T extends Record<string, any>>(baseKey: string) => {
  return {
    all: [baseKey] as const,
    lists: () => [...createQueryKeys(baseKey).all, 'list'] as const,
    list: (filters: T) => [...createQueryKeys(baseKey).lists(), { filters }] as const,
    details: () => [...createQueryKeys(baseKey).all, 'detail'] as const,
    detail: (id: string) => [...createQueryKeys(baseKey).details(), id] as const,
    project: (projectId: string) => [...createQueryKeys(baseKey).all, 'project', projectId] as const,
  };
};
