"use client";

import { DataTable } from "@/core/components/global/data-table";
import { VisiteTerrainColumns } from "@/core/view/rapports/columns/visite-terrain-column";
import { useGetVisiteTerrain } from "@/core/hooks/use-vt";
import { CrudPermissions, VisiteTerrainDetail } from "@/core/lib/types";

type Props = {
  permission: CrudPermissions;
};
const VisiteTerrain = ({permission}:Props) => {
  const { data: visiteTerrains, isPending: vloading } = useGetVisiteTerrain();

 
  return (
    <DataTable<VisiteTerrainDetail>
      data={visiteTerrains ? visiteTerrains : []}
      columns={VisiteTerrainColumns(permission)}
      searchPlaceholder="Rechercher par nom ou date..."
      searchField="name"
      additionalSearchFields={["phone", "email", "status"]}
      canAdd={false}
      pageSize={10}
      isPending={vloading}
    />
  );
};

export default VisiteTerrain;
