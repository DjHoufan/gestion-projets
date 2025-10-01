"use client";

import { DataTable } from "@/core/components/global/data-table";
import { ConflitColumns } from "@/core/view/rapports/columns/conflit-column";
import { useGetConflit } from "@/core/hooks/use-conflit";
import { ConflitDetail, CrudPermissions } from "@/core/lib/types";

type Props = {
  permission: CrudPermissions;
};


const Conflit = ({permission}:Props) => {
  const { data: conflits, isPending: cloading } = useGetConflit();


  return (
    <DataTable<ConflitDetail>
      data={conflits ? conflits : []}
      columns={ConflitColumns(permission)}
      searchPlaceholder="Rechercher par nom ou date..."
      searchField="name"
      additionalSearchFields={["users.name","accompaniment.name"]}
      canAdd={false}
      pageSize={10}
      isPending={cloading}
    />
  );
};

export default Conflit;
