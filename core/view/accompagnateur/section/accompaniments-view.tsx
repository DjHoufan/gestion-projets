"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Button } from "@/core/components/ui/button";
import {
  Users,
  MapPin,
  FolderOpen,
  Eye,
  LinkIcon,
  ChevronsLeftRightEllipsis,
} from "lucide-react";
import { DataTable } from "@/core/components/global/data-table";
import { Accompaniment } from "@prisma/client";

import { useCustomeTabs, useMyData, useSelectAC } from "@/core/hooks/store";

export interface AccompanimentListItem extends Accompaniment {
  projectName: string;
  projectStatus: boolean;
  totalMembers: number;
  totalPurchases: number;
  totalPurchaseAmount: number;
}

export function AccompanimentsView() {
  const { data: user } = useMyData();

  if (!user) {
    return <div>Chargement...</div>;
  }

  const { set: SetUrl } = useCustomeTabs();
  const { set } = useSelectAC();

  const accompanimentsList: AccompanimentListItem[] = user.accompaniments.map(
    (acc: any) => ({
      ...acc,
      projectName: acc.project?.name || "Aucun projet assigné",
      projectStatus: acc.project?.status || false,
      totalMembers: acc.members.length,
      totalPurchases: acc.purchases?.length || 0,
      totalPurchaseAmount:
        acc.purchases?.reduce((sum: number, p: any) => sum + p.total, 0) || 0,
    })
  );

  const columns = [
    {
      id: "accompaniment",
      header: "Accompagnement",
      cell: ({ row }: any) => {
        const accompaniment = row.original;
        return (
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-gray-900 text-base">
              {accompaniment.name}
            </h3>
            <div className="text-sm text-gray-500">
              {accompaniment.phones.join(", ")}
            </div>
          </div>
        );
      },
      size: 200,
    },
    {
      id: "Cohorte",
      header: "Cohorte",
      cell: ({ row }: any) => {
        const accompaniment = row.original;
        return (
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <FolderOpen className="h-3.5 w-3.5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-700 font-medium">
              {accompaniment.projectName}
            </span>
          </div>
        );
      },
      size: 150,
    },
    {
      id: "status",
      header: "Statut",
      cell: ({ row }: any) => {
        const accompaniment = row.original;
        return (
          <Badge
            variant={accompaniment.status ? "default" : "secondary"}
            className={
              accompaniment.status
                ? "bg-emerald-100 text-emerald-700 border-emerald-200 font-medium"
                : "bg-gray-100 text-gray-700 border-gray-200 font-medium"
            }
          >
            {accompaniment.status ? "Actif" : "En cours"}
          </Badge>
        );
      },
      size: 120,
    },
    {
      id: "address",
      header: "Adresse",
      cell: ({ row }: any) => {
        const accompaniment = row.original;
        return (
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gray-100 rounded-lg">
              <MapPin className="h-3.5 w-3.5 text-gray-600" />
            </div>
            <span
              className="text-sm text-gray-700 max-w-32 truncate font-medium"
              title={accompaniment.adresse}
            >
              {accompaniment.adresse}
            </span>
          </div>
        );
      },
      size: 200,
    },
    {
      id: "members",
      header: "Membres",
      cell: ({ row }: any) => {
        const accompaniment = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {accompaniment.members
                .slice(0, 3)
                .map((member: any, index: number) => (
                  <Avatar
                    key={member.id}
                    className="h-7 w-7 border-2 border-white ring-1 ring-gray-200"
                  >
                    <AvatarImage
                      src={member.profile || "/placeholder.svg"}
                      alt={member.name}
                    />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-semibold">
                      {member.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                ))}
              {accompaniment.totalMembers > 3 && (
                <div className="h-7 w-7 rounded-full bg-gray-100 border-2 border-white ring-1 ring-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-600 font-semibold">
                    +{accompaniment.totalMembers - 3}
                  </span>
                </div>
              )}
            </div>
            <span className="text-sm text-gray-600 font-medium">
              {accompaniment.totalMembers}
            </span>
          </div>
        );
      },
      size: 180,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const accompaniment = row.original;
        return (
          <Button
            onClick={() => {
              set(accompaniment.id);
              SetUrl("detailAccompaniments");
            }}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors duration-150"
          >
            <Eye className="h-4 w-4" />
            Détails
          </Button>
        );
      },
      size: 120,
    },
  ];

  return (
    <section className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Accompagnements</h2>
      </div>

      {/* Global Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-100 rounded-full -mr-10 -mt-10"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Accompagnements
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {user.accompaniments.length}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -mr-10 -mt-10"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Totale des cohortes auxquelles vous participez.</p>
                <p className="text-3xl font-bold text-gray-900">
                  {
                    new Set(
                      user.accompaniments
                        .map((acc: any) => acc.project?.id)
                        .filter(Boolean)
                    ).size
                  }
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FolderOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 rounded-full -mr-10 -mt-10"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Membres
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {user.accompaniments.reduce(
                    (total: number, acc: any) => total + acc.members.length,
                    0
                  )}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable<AccompanimentListItem>
        data={accompanimentsList ? accompanimentsList : []}
        columns={columns}
        searchPlaceholder="Rechercher par nom ou date..."
        searchField="name"
        additionalSearchFields={["name", "projectName", "[members.name]"]}
        header={false}
        canAdd={false}
        pageSize={10}
        isPending={false}
        filters={[
          {
            label: "Filtrer par projet",
            field: "projectName",
            type: "select",
            icon: LinkIcon,
          },
          {
            label: "Filtrer par statut",
            field: "projectStatus",
            type: "select",
            icon: ChevronsLeftRightEllipsis,
          },
        ]}
      />
    </section>
  );
}
