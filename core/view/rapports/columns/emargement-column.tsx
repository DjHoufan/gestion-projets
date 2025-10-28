import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/core/components/ui/badge";

import { CrudPermissions, EmargementDetail } from "@/core/lib/types";
import { CellAction } from "@/core/view/rapports/cell-action";

import { EmargementForm } from "@/core/view/rapports/form/emargement-form";
import { useDeleteEmargement } from "@/core/hooks/use-rapport";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { EmargementShow } from "@/core/view/rapports/card/emargement-show";

export const EmargementColumns = (
  permission: CrudPermissions
): ColumnDef<EmargementDetail>[] => [
  {
    id: "CNI",
    header: "Bénéficiaire",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-16 relative">
            {row.original.PhotoCni ? (
              <img
                className="w-full h-full object-cover rounded border border-gray-200"
                src={row.original.PhotoCni}
                alt="Photo CNI"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-gray-500 border rounded">
                Aucune photo
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-primary-900">
              {row.original.cni}
            </span>
            <span className="text-xs text-primary-600">
              {row.original.member.name}
            </span>
          </div>
        </div>
      );
    },
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
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <span>{format(row.original.date, "dd/MM/yyyy", { locale: fr })}</span>
    ),
  },
  {
    accessorKey: "montant",
    header: "Montant",
    cell: ({ row }) => (
      <span className="font-semibold">
        {row.original.montant.toLocaleString()} Fdj
      </span>
    ),
  },
  {
    accessorKey: "signature",
    header: "Signature",
    cell: ({ row }) => (
      <Badge variant={row.original.signature ? "default" : "secondary"}>
        {row.original.signature ? "Signée" : "Non signée"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <CellAction<EmargementDetail>
        details={row.original}
        FormComponent={EmargementForm}
        DeleteHookAction={useDeleteEmargement}
        DetailComponent={EmargementShow}
        getDeleteParamAction={(details) => ({ param: { emId: details.id } })}
        entityName="l'émargement"
        idField="id"
        permission={permission}
      />
    ),
  },
];
