import { ColumnDef } from "@tanstack/react-table";

import { CrudPermissions, VisiteTerrainDetail } from "@/core/lib/types";
import { CellAction } from "@/core/view/rapports/cell-action";

import { useDeleteVisiteTerrain } from "@/core/hooks/use-vt";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { VisiteTerrainForm } from "@/core/view/rapports/form/visite-terrain-form";
import { Clock } from "lucide-react";
import { VisitShow } from "@/core/view/rapports/card/vt-show";

export const VisiteTerrainColumns = (
  permission: CrudPermissions
): ColumnDef<VisiteTerrainDetail>[] => [
  {
    header: "Accompagnament",
    cell: ({ row }) => (
      <span>{row.original.visit.Planning.accompaniments[0].name}</span>
    ),
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
    accessorKey: "visit",
    header: "Visite",
    cell: ({ row }) => {
      const tour = row.original.visit;

      return (
        <div className="flex items-center justify-between   ">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center justify-center bg-teal-100 rounded-md p-1.5 w-10">
              <span className="text-xs font-bold text-teal-800">
                {new Date(tour.date).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                })}
              </span>
              <span className="text-[10px] text-teal-600">
                {new Date(tour.date).toLocaleDateString("fr-FR", {
                  month: "short",
                })}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900">{tour.location}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {tour.startTime} - {tour.endTime}
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    header: "Personne",
    cell: ({ row }) => (
      <span className="font-semibold">
        {row.original.personnes.length} ersonne
        {row.original.personnes.length > 1 && "s"}
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
      <CellAction<VisiteTerrainDetail>
        details={row.original}
        DetailComponent={VisitShow}
        FormComponent={VisiteTerrainForm}
        DeleteHookAction={useDeleteVisiteTerrain}
        getDeleteParamAction={(details) => ({ param: { emId: details.id } })}
        entityName="cette viste de terrain"
        idField="id"
        permission={permission}
      />
    ),
  },
];
