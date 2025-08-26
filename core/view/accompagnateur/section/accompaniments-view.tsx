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
  Phone,
  DollarSign,
  Calendar,
  FolderOpen,
  ChevronDown,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/core/components/ui/collapsible";

import { useCustomeTabs, useSelectAC } from "@/core/hooks/store";

interface AccompanimentsViewProps {
  user: any;
}

export function AccompanimentsView({ user }: AccompanimentsViewProps) {
    const { set: SetUrl } = useCustomeTabs();
  const { set } = useSelectAC();
  // Group accompaniments by project
  const projectGroups = user.accompaniments.reduce((groups: any, acc: any) => {
    const projectId = acc.project?.id || "no-project";

    if (!groups[projectId]) {
      groups[projectId] = {
        project: acc.project || { name: "Aucun projet assigné", status: false },
        accompaniments: [],
      };
    }

    groups[projectId].accompaniments.push(acc);
    return groups;
  }, {});

  return (
    <section className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Accompagnements par Projet
        </h2>
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
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Projets Actifs
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {Object.keys(projectGroups).length}
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

      {/* Accompaniments by Project */}
      <div className="space-y-6">
        {Object.entries(projectGroups).map(
          ([projectId, group]: [string, any]) => (
            <Collapsible key={projectId} defaultOpen={true}>
              <div className="space-y-4">
                {/* Project Header */}
                <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-emerald-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <ChevronDown className="h-4 w-4 text-emerald-600 transition-transform group-data-[state=closed]:rotate-[-90deg]" />
                          <FolderOpen className="h-5 w-5 text-emerald-600" />
                          {group.project.name}
                        </CardTitle>
                        <div className="flex items-center gap-4">
                          <Badge
                            variant={
                              group.project.status ? "default" : "secondary"
                            }
                            className="bg-emerald-100 text-emerald-700"
                          >
                            {group.project.status ? "Actif" : "En cours"}
                          </Badge>
                          <div className="text-sm text-emerald-700">
                            {group.accompaniments.length} accompagnement(s)
                          </div>
                        </div>
                      </div>
                      {group.project.startDate && group.project.endDate && (
                        <div className="flex items-center gap-4 text-sm text-emerald-600 mt-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Début:{" "}
                              {new Date(
                                group.project.startDate
                              ).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Fin:{" "}
                              {new Date(
                                group.project.endDate
                              ).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardHeader>
                  </CollapsibleTrigger>
                </Card>

                <CollapsibleContent>
                  {/* Accompaniments in this project */}
                  <div className="grid gap-6 ml-4">
                    {group.accompaniments.map((accompaniment: any) => (
                      <Card
                        key={accompaniment.id}
                        className="border-l-4 border-l-emerald-500"
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                              <Users className="h-5 w-5 text-emerald-600" />
                              {accompaniment.name}
                            </CardTitle>
                            <Badge
                              variant={
                                accompaniment.status ? "default" : "secondary"
                              }
                              className="bg-emerald-100 text-emerald-700"
                            >
                              {accompaniment.status ? "Actif" : "En cours"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Basic Info */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">
                                {accompaniment.adresse}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">
                                {accompaniment.phones.join(", ")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">
                                {accompaniment.budget.toLocaleString()} DJF
                              </span>
                            </div>
                          </div>

                          {/* Members */}
                          <div>
                            <h4 className="font-medium text-sm mb-3">
                              Membres ({accompaniment.members.length})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {accompaniment.members.map((member: any) => (
                                <div
                                  key={member.id}
                                  className="flex items-center gap-3 p-3 bg-white border rounded-lg"
                                >
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage
                                      src={member.profile || "/placeholder.svg"}
                                      alt={member.name}
                                    />
                                    <AvatarFallback className="bg-emerald-100 text-emerald-700">
                                      {member.name
                                        .split(" ")
                                        .map((n: string) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">
                                      {member.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {member.email}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {member.formation}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Purchase Summary */}
                          {accompaniment.purchases &&
                            accompaniment.purchases.length > 0 && (
                              <div className="p-3 bg-emerald-50 rounded-lg">
                                <h4 className="font-medium text-sm mb-2">
                                  Résumé des Achats
                                </h4>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">
                                    {accompaniment.purchases.length}{" "}
                                    transaction(s)
                                  </span>
                                  <span className="font-medium text-emerald-700">
                                    {accompaniment.purchases
                                      .reduce(
                                        (acc: number, p: any) => acc + p.total,
                                        0
                                      )
                                      .toLocaleString()}{" "}
                                    DJF
                                  </span>
                                </div>
                              </div>
                            )}

                          {/* Actions */}
                          <div className="flex gap-2 pt-2">
                            <Button
                              onClick={() => {
                                set(accompaniment.id);
                                SetUrl("detailAccompaniments");
                              }}
                              variant="outline"
                              size="sm"
                            >
                              Voir Détails
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          )
        )}
      </div>

      {/* Project Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé par Projet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(projectGroups).map(
              ([projectId, group]: [string, any]) => {
                const totalBudget = group.accompaniments.reduce(
                  (sum: number, acc: any) => sum + acc.budget,
                  0
                );
                const totalMembers = group.accompaniments.reduce(
                  (sum: number, acc: any) => sum + acc.members.length,
                  0
                );
                const totalPurchases = group.accompaniments.reduce(
                  (sum: number, acc: any) => sum + (acc.purchases?.length || 0),
                  0
                );

                return (
                  <div key={projectId} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-3">{group.project.name}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Accompagnements:</span>
                        <span className="font-medium">
                          {group.accompaniments.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Membres:</span>
                        <span className="font-medium">{totalMembers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Budget total:</span>
                        <span className="font-medium text-emerald-600">
                          {totalBudget.toLocaleString()} DJF
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Achats:</span>
                        <span className="font-medium">{totalPurchases}</span>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
