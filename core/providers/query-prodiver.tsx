"use client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { toast } from "@/core/components/global/custom-toast";
// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import {
  isServer,
  QueryClient,
  QueryClientProvider,
  MutationCache,
  QueryCache,
} from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // ✅ Optimisations de cache
        staleTime: 5 * 60 * 1000, // 5 minutes (au lieu de 5 heures)
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error: any) => {
          // ✅ Retry intelligent
          if (error?.status === 404 || error?.status === 403) return false;
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnReconnect: 'always',
        // ✅ Background refetch optimisé
        refetchInterval: false,
        refetchIntervalInBackground: false,
      },
      mutations: {
        // ✅ Retry pour les mutations
        retry: (failureCount, error: any) => {
          if (error?.status >= 400 && error?.status < 500) return false;
          return failureCount < 2;
        },
        retryDelay: 1000,
      },
    },
    // ✅ Cache global pour les erreurs
    queryCache: new QueryCache({
      onError: (error: any, query) => {
        // Log des erreurs sans spam
        if (error?.status !== 404) {
          console.error(`Query error for ${query.queryKey}:`, error);
        }
      },
    }),
    // ✅ Cache global pour les mutations
    mutationCache: new MutationCache({
      onError: (error: any) => {
        toast.error({
          message: error?.message || "Une erreur est survenue",
        });
      },
    }),
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProviders = ({ children }: QueryProviderProps) => {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
