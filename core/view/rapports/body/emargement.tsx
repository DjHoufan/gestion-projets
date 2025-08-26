"use client";

import { DataTable } from "@/core/components/global/data-table";
import { EmargementColumns } from "@/core/view/rapports/columns/emargement-column";
import { useGetEmargement } from "@/core/hooks/use-rapport";
import { CrudPermissions, EmargementDetail } from "@/core/lib/types";

type Props = {
  permission: CrudPermissions;
};

const Emargement = ({ permission }: Props) => {
  const { data: emargements, isPending: eloading } = useGetEmargement();

  return (
    <DataTable<EmargementDetail>
      data={emargements ? emargements : []}
      columns={EmargementColumns(permission)}
      searchPlaceholder="Rechercher par nom ou date..."
      searchField="name"
      additionalSearchFields={["phone", "email", "status"]}
      canAdd={false}
      pageSize={10}
      isPending={eloading}
    />
  );
};

export default Emargement;
