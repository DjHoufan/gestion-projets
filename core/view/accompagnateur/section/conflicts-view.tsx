"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/core/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/core/components/ui/avatar";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Users,
  Download,
  Eye,
} from "lucide-react";
import { ConflitDetail, ViewProps } from "@/core/lib/types";
import { DataTable } from "@/core/components/global/data-table";
import { useModal } from "@/core/providers/modal-provider";
import { ConflitForm } from "@/core/view/rapports/form/conflit-form";

export function ConflictsView({ user }: ViewProps) {
  const resolvedConflicts = user.conflit.filter(
    (conflict: any) => conflict.resolution && conflict.resolution.trim() !== ""
  );
  const unresolvedConflicts = user.conflit.filter(
    (conflict: any) => !conflict.resolution || conflict.resolution.trim() === ""
  );

  const { open, close } = useModal();

  const columns = [
    {
      id: "id",
      header: "ID",
      cell: ({ row }: any) => (
        <span className="font-mono text-xs">
          #{row.original.id.slice(0, 8)}
        </span>
      ),
      size: 120,
    },
    {
      id: "nature",
      header: "Nature",
      cell: ({ row }: any) => (
        <div className="max-w-xs truncate" title={row.original.nature}>
          {row.original.nature}
        </div>
      ),
      size: 200,
    },
    {
      id: "status",
      header: "Statut",
      cell: ({ row }: any) => {
        const isResolved =
          row.original.resolution && row.original.resolution.trim() !== "";
        return (
          <Badge
            variant={isResolved ? "default" : "destructive"}
            className={
              isResolved
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          >
            {isResolved ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" /> Résolu
              </>
            ) : (
              <>
                <Clock className="h-3 w-3 mr-1" /> En cours
              </>
            )}
          </Badge>
        );
      },
      size: 150,
    },
    {
      id: "parties",
      header: "Parties",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          <span className="text-sm">
            {row.original.partieImpliques?.length || 0}
          </span>
        </div>
      ),
      size: 120,
    },
    {
      id: "files",
      header: "Fichiers",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{row.original.files?.length || 0}</span>
        </div>
      ),
      size: 120,
    },
    {
      id: "createdAt",
      header: "Date Création",
      cell: ({ row }: any) => (
        <span className="text-sm text-gray-600">
          {new Date(row.original.createdAt).toLocaleDateString("fr-FR")}
        </span>
      ),
      size: 150,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const conflict = row.original;
        const isResolved =
          conflict.resolution && conflict.resolution.trim() !== "";

        return (
          <div className="flex gap-1">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-transparent"
                >
                  <Eye className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <ConflictDetailsModal conflict={conflict} />
            </Dialog>
            {!isResolved && (
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 h-8 text-xs px-2"
              >
                Résoudre
              </Button>
            )}
          </div>
        );
      },
      size: 150,
    },
  ];

  const ConflictDetailsModal = ({ conflict }: { conflict: any }) => {
    const isResolved = conflict.resolution && conflict.resolution.trim() !== "";

    return (
      <DialogContent className="!max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle
              className={`h-5 w-5 ${
                isResolved ? "text-green-600" : "text-red-600"
              }`}
            />
            Détails du Conflit #{conflict.id.slice(0, 8)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge
              variant={isResolved ? "default" : "destructive"}
              className={`${
                isResolved
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              } px-4 py-2`}
            >
              {isResolved ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" /> Conflit Résolu
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-2" /> Conflit En Cours
                </>
              )}
            </Badge>
          </div>

          {/* Conflict Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Nature du Conflit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{conflict.nature}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Résolution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isResolved ? (
                  <p className="text-sm leading-relaxed">
                    {conflict.resolution}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Aucune résolution enregistrée
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Parties Involved */}
          {conflict.partieImpliques && conflict.partieImpliques.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Parties Impliquées ({conflict.partieImpliques.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {conflict.partieImpliques.map((partie: any) => (
                    <div
                      key={partie.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-emerald-100 text-emerald-700">
                            {partie.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{partie.name}</p>
                          <p className="text-xs text-gray-500">
                            Rôle: {partie.role}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={partie.signature ? "default" : "secondary"}
                        className={
                          partie.signature ? "bg-green-100 text-green-700" : ""
                        }
                      >
                        {partie.signature ? "Signé" : "Non signé"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Files */}
          {conflict.files && conflict.files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Fichiers Associés ({conflict.files.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {conflict.files.map((file: any) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-blue-100 rounded">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-medium text-sm truncate"
                            title={file.name}
                          >
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            Type: {file.type}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2 bg-transparent"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chronologie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-1"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Conflit signalé</p>
                    <p className="text-xs text-gray-500">
                      {new Date(conflict.createdAt).toLocaleDateString("fr-FR")}{" "}
                      à{" "}
                      {new Date(conflict.createdAt).toLocaleTimeString("fr-FR")}
                    </p>
                  </div>
                </div>
                {conflict.updatedAt !== conflict.createdAt && (
                  <div
                    className={`flex items-start gap-4 p-4 ${
                      isResolved ? "bg-green-50" : "bg-orange-50"
                    } rounded-lg`}
                  >
                    <div
                      className={`w-3 h-3 ${
                        isResolved ? "bg-green-500" : "bg-orange-500"
                      } rounded-full mt-1`}
                    ></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {isResolved ? "Conflit résolu" : "Dernière mise à jour"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(conflict.updatedAt).toLocaleDateString(
                          "fr-FR"
                        )}{" "}
                        à{" "}
                        {new Date(conflict.updatedAt).toLocaleTimeString(
                          "fr-FR"
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    );
  };

  return (
    <section className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Gestion des Conflits
        </h2>
        <Button
          onClick={() =>
            open(<ConflitForm open={true} onOpenChangeAction={close} />)
          }
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Signaler un Conflit
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-100 rounded-full -mr-10 -mt-10"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Conflits
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {user.conflit.length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -mr-10 -mt-10"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Résolus
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {resolvedConflicts.length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-100 rounded-full -mr-10 -mt-10"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  En Cours
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {unresolvedConflicts.length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conflicts Table */}

      <DataTable<Partial<ConflitDetail> & { id: string }>
        data={user.conflit ? user.conflit : []}
        columns={columns}
        searchPlaceholder="Rechercher par nom ou date..."
        searchField="name"
        additionalSearchFields={["phone", "email", "status"]}
        title="des achats"
        description="Gérez les informations et les dépenses de vos différents accompagnements"
        canAdd={false}
        pageSize={10}
        addButtonText="Enregistre un nouveau bénéficiaires"
        isPending={user.conflit ? false : true}
      />

      {user.conflit.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun conflit signalé
            </h3>
            <p className="text-gray-500 mb-4">
              C'est une bonne nouvelle ! Aucun conflit n'a été signalé pour le
              moment.
            </p>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Signaler un Conflit
            </Button>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
