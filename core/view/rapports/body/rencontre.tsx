"use client";

import { DataTable } from "@/core/components/global/data-table";
import { RencontreColumns } from "@/core/view/rapports/columns/rencontre-column";
import { useGetRencontre } from "@/core/hooks/use-rencontre";
import { CrudPermissions, RencontreDetail } from "@/core/lib/types";

type Props = {
  permission: CrudPermissions;
};

const Rencontre = ({ permission }: Props) => {
  const { data: rencontres, isPending: rloading } = useGetRencontre();

  return (
    <DataTable<RencontreDetail>
      data={rencontres ? rencontres : []}
      columns={RencontreColumns(permission)}
      searchPlaceholder="Rechercher par nom ou date..."
      searchField="name"
      additionalSearchFields={["phone", "email", "status"]}
      canAdd={false}
      pageSize={10}
      isPending={rloading}
    />
  );
};

export default Rencontre;
