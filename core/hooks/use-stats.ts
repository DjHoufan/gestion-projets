import { useQuery } from "@tanstack/react-query";

import { client } from "@/core/lib/rpc";
import { QueryKeyString } from "@/core/lib/constants";

type DashboardStat = {
  title: "Project" | "Member" | "Accompaniment" | "Visits";
  value: string;
  change: string; // ex: "+2 vs l'année dernière"
};

export const useGetDashboardStats = () =>
  useQuery<DashboardStat[]>({
    queryKey: [QueryKeyString.DashboardStats],
    queryFn: async () => {
      const res = await client.api.stats.DashboardStats.$get();
      if (!res.ok)
        throw new Error(res.statusText || "Erreur récupération stats");
      const { data } = await res.json();
      return data as DashboardStat[];
    },

    // --- Optimisations cache ---
    staleTime: 1000 * 60 * 5, // 5 min : pas de refetch inutile
    gcTime: 1000 * 60 * 30, // 30 min avant que les données sortent du cache
    refetchOnWindowFocus: false, // évite refetch à chaque changement d’onglet
    refetchOnReconnect: false, // refetch si perte/reconnexion réseau
  });

export const useGetStatsData = () => {
  return useQuery({
    queryKey: [QueryKeyString.statsData],
    queryFn: async () => {
      const response = await client.api.stats.statsData.$get();

      if (!response.ok) {
        throw new Error("Échec de la récupération des stats statsData");
      }
      const { data } = await response.json();
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 min : pas de refetch inutile
    gcTime: 1000 * 60 * 30, // 30 min avant que les données sortent du cache
    refetchOnWindowFocus: false, // évite refetch à chaque changement d’onglet
    refetchOnReconnect: false, // refetch si perte/reconnexion réseau
  });
};

export const useGetSatsProjectUsers = () => {
  return useQuery({
    queryKey: [QueryKeyString.SatsProjectUsers],
    queryFn: async () => {
      const response = await client.api.stats.SatsProjectUsers.$get();

      if (!response.ok) {
        throw new Error("Échec de la récupération des stats SatsProjectUsers");
      }
      const { data } = await response.json();

      return data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useGetActivities = () => {
  return useQuery({
    queryKey: [QueryKeyString.Activities],
    queryFn: async () => {
      const response = await client.api.stats.Activities.$get();

      if (!response.ok) {
        throw new Error("Échec de la récupération des stats Activities");
      }
      const { data } = await response.json();

      return data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};





 export const useGetakis = () => {
  return useQuery({
    queryKey: [QueryKeyString.akis],
    queryFn: async () => {
      const response = await client.api.stats.akis.$get();

      if (!response.ok) {
        throw new Error("Échec de la récupération des stats Activities");
      }
      const { data } = await response.json();

      return data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

