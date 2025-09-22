import { ColumnDef } from "@tanstack/react-table";

import { ConflitDetail, CrudPermissions } from "@/core/lib/types";
import { CellAction } from "@/core/view/rapports/cell-action";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { ConflitForm } from "@/core/view/rapports/form/conflit-form";
import { useDeleteConflit } from "@/core/hooks/use-conflit";
import { ConflictShow } from "@/core/view/rapports/card/conflit-show";
import { TruncatedTextWithDialog } from "@/core/view/accompagnateur/section/rencontre-view";

export const ConflitColumns = (
  permission: CrudPermissions
): ColumnDef<ConflitDetail>[] => [
  {
    header: "Accompagnament",
    cell: ({ row }) => <span>{row.original.accompaniment.name}</span>,
  },
  {
    id: "user",
    header: "Accompagnateur",
    cell: ({ row }) => {
      const users = row.original.users;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border border-primary-200">
            <AvatarImage src={users.profile || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-br from-primary-400 to-primary-600 text-white">
              {users.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-primary-900">{users.name}</span>
            <span className="text-xs text-primary-600">{users.phone}</span>
          </div>
        </div>
      );
    },
    size: 250,
  },
  {
    accessorKey: "nature",
    header: "Nature",
    cell: ({ row }: any) => (
      <TruncatedTextWithDialog
        items={[row.original.nature]}
        type="nature"
        maxLength={40}
      />
    ),
  },

  {
    header: "Personne",
    cell: ({ row }) => (
      <span className="font-semibold">
        {row.original.partieImpliques.length} partie implique
      </span>
    ),
  },

  {
    header: "Documents",
    cell: ({ row }) => (
      <span className="font-semibold">
        {row.original.files.length} document
        {row.original.files.length > 1 && "s"}
      </span>
    ),
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <CellAction<ConflitDetail>
        details={row.original}
        FormComponent={ConflitForm}
        DetailComponent={ConflictShow}
        DeleteHookAction={useDeleteConflit}
        getDeleteParamAction={(details) => ({ param: { cId: details.id } })}
        entityName={`le conflit ${row.original.nature} `}
        idField="id"
        permission={permission}
      />
    ),
  },
];
