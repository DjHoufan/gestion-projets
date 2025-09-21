import { ColumnDef } from "@tanstack/react-table";
import { Calendar, MapPin, FileIcon, Users } from "lucide-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/core/components/ui/avatar";
import { Badge } from "@/core/components/ui/badge";
import { CrudPermissions, RencontreDetail } from "@/core/lib/types";
import { CellAction } from "@/core/view/rapports/cell-action";

import { RencontreForm } from "@/core/view/rapports/form/rencontre-form";
import { useDeleteRencontre } from "@/core/hooks/use-rencontre";
import { formatDateShort } from "@/core/lib/utils";
import { RencontreShow } from "@/core/view/rapports/card/rencontre-show";

export const RencontreColumns = (
  permission: CrudPermissions
): ColumnDef<RencontreDetail>[] => [
  {
    header: "Date",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Calendar className="h-4 w-4" />
          {formatDateShort(row.original.visit.date)}
        </div>
        <div className="text-xs text-muted-foreground">
          {new Date(row.original.visit.date).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    ),
    size: 150,
  },
  {
    header: "Lieu",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{row.original.visit.location}</span>
      </div>
    ),
    size: 150,
  },
  {
    header: "Accompagnement",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium text-sm">
          {row.original.accompaniment.name}
        </div>
      </div>
    ),
    size: 250,
  },
  {
    header: "Accompagnateur",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={row.original.users.profile || "/placeholder.svg"}
            alt={row.original.users.name}
          />
          <AvatarFallback>
            {row.original.users.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium text-sm">{row.original.users.name}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.users.email}
          </div>
        </div>
      </div>
    ),
    size: 200,
  },

  {
    header: "Fichiers",
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-xs">
        <FileIcon className="h-3 w-3 mr-1" />
        {row.original.files.length}
      </Badge>
    ),
    size: 100,
  },
  {
    header: "Signatures",
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-xs">
        <Users className="h-3 w-3 mr-1" />
        {row.original.signatures.length}
      </Badge>
    ),
    size: 100,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <CellAction<RencontreDetail>
        details={row.original}
        FormComponent={RencontreForm}
        DetailComponent={RencontreShow}
        DeleteHookAction={useDeleteRencontre}
        getDeleteParamAction={(details) => ({ param: { emId: details.id } })}
        entityName="cette rencontre"
        idField="id"
        permission={permission}
      />
    ),
  },
];
