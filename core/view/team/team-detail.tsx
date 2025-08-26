"use client";
import { useGetOnTeam } from "@/core/hooks/use-teams";
import { IdType } from "@/core/lib/types";

export const TeamDetail = ({ Id }: IdType) => {
  const { data, isPending } = useGetOnTeam(Id);

 

  return (
    <div>
      Team {Id} {isPending ? "chargement ..." : "done"}
    </div>
  );
};
