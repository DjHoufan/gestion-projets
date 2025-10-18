"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";

import { Badge } from "@/core/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import { Flag, Eye, Calendar, User, RefreshCw, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import { DataTable } from "@/core/components/global/data-table";
import { SignalementDetails } from "@/core/lib/types";
import {
  useGetSignalement,
  useUpdateStatusSignalement,
} from "@/core/hooks/use-superivision";
import { Spinner } from "@/core/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";

const typeLabels: Record<string, string> = {
  observation: "Observation",
  incident: "Incident",
  probleme: "Problème",
  suggestion: "Suggestion",
  urgence: "Urgence",
  autre: "Autre",
};

export default function SignalementsBody() {
  const { data: signalements, isPending } = useGetSignalement();
  const { mutate: updateStatut, isPending: isLoading } =
    useUpdateStatusSignalement();
  const [selectedSignalement, setSelectedSignalement] = useState<any>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const getStatutBadgeColor = (statut: string) => {
    switch (statut) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-300";
      case "en_cours":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "resolu":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "urgence":
        return "bg-red-50 text-red-700 border-red-200";
      case "incident":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "probleme":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "observation":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "suggestion":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleViewDetails = (signalement: any) => {
    setSelectedSignalement(signalement);
    setDetailDialogOpen(true);
  };

  const handleChangeStatus = (signalement: any) => {
    setSelectedSignalement(signalement);
    setNewStatus(signalement.statut);
    setStatusDialogOpen(true);
  };

  const columns = [
    {
      id: "type",
      header: "Type",
      cell: ({ row }: any) => {
        const signalement = row.original;
        const typeLabels = {
          incident: "Incident",
          demande: "Demande",
          suggestion: "Suggestion",
          autre: "Autre",
        };

        return (
          <Badge
            variant="outline"
            className={getTypeBadgeColor(signalement.type)}
          >
            {typeLabels[signalement.type as keyof typeof typeLabels] ||
              signalement.type}
          </Badge>
        );
      },
      size: 120,
    },
    {
      id: "groupe",
      header: "Groupe",
      accessorKey: "groupeAccompagnement",
      cell: ({ row }: any) => (
        <span className="max-w-xs truncate block">
          {row.original.groupe.name}
        </span>
      ),
      size: 200,
    },
    {
      id: "statut",
      header: "Statut",
      cell: ({ row }: any) => {
        const signalement = row.original;
        const statutLabels = {
          nouveau: "Nouveau",
          en_cours: "En cours",
          resolu: "Résolu",
          ferme: "Fermé",
        };

        return (
          <Badge
            variant="outline"
            className={getStatutBadgeColor(signalement.statut)}
          >
            {statutLabels[signalement.statut as keyof typeof statutLabels] ||
              signalement.statut}
          </Badge>
        );
      },
      size: 120,
    },

    {
      id: "date",
      header: "Date",
      cell: ({ row }: any) => (
        <span>{new Date(row.original.date).toLocaleDateString("fr-FR")}</span>
      ),
      size: 120,
    },
    {
      id: "accompagnateur",
      header: "Accompagnateur",
      accessorKey: "accompagnateur",
      cell: ({ row }: any) => <span>{row.original.user.name}</span>,
      size: 150,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const signalement = row.original;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-2">
                  <Eye className="h-4 w-4" />
                  Voir
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => handleViewDetails(signalement)}
                  className="flex items-center gap-2 rounded-lg cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                  Voir les détails
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleChangeStatus(signalement)}
                  className="flex items-center gap-2 rounded-lg cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4" />
                  Changer statut
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => console.log("Supprimer", signalement)}
                  className="flex items-center gap-2 rounded-lg cursor-pointer text-red-600"
                >
                  <Trash className="h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      size: 120,
    },
  ];

  const handleSaveStatus = () => {
    updateStatut(
      {
        param: {
          id: selectedSignalement?.id,
          statut: newStatus,
        },
      },
      {
        onSuccess: () => {
          setStatusDialogOpen(false);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Titre de la page */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Flag className="h-8 w-8 text-orange-600" />
            Liste des Signalements
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez et suivez tous les signalements des groupes d'accompagnement
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {signalements ? (
                      signalements.length
                    ) : (
                      <Spinner variant="circle" className="text-primary" />
                    )}
                  </p>
                </div>
                <Flag className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Urgents</p>
                  <p className="text-2xl font-bold text-red-600">
                    {signalements ? (
                      signalements.filter((s) => s.statut === "urgent").length
                    ) : (
                      <Spinner variant="circle" className="text-primary" />
                    )}
                  </p>
                </div>
                <Flag className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En cours</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {signalements ? (
                      signalements.filter((s) => s.statut === "En cours").length
                    ) : (
                      <Spinner variant="circle" className="text-primary" />
                    )}
                  </p>
                </div>
                <Flag className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Résolus</p>
                  <p className="text-2xl font-bold text-green-600">
                    {signalements ? (
                      signalements.filter((s) => s.statut === "resolu").length
                    ) : (
                      <Spinner variant="circle" className="text-primary" />
                    )}
                  </p>
                </div>
                <Flag className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <DataTable<SignalementDetails>
          header={false}
          data={signalements ? signalements : []}
          columns={columns}
          searchPlaceholder="Rechercher par nom ou date..."
          searchField="name"
          additionalSearchFields={["phone", "email", "status"]}
          canAdd={false}
          pageSize={10}
          isPending={isPending}
        />
      </div>

      {/* Dialog Détails */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="!max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Flag className="h-6 w-6 text-orange-600" />
              Détails du Signalement
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur le signalement{" "}
              {selectedSignalement?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedSignalement && (
            <div className="space-y-6">
              {/* En-tête */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedSignalement.groupeAccompagnement}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    ID: {selectedSignalement.id}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className={getTypeBadgeColor(selectedSignalement.type)}
                  >
                    {typeLabels[selectedSignalement.type]}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={getStatutBadgeColor(selectedSignalement.statut)}
                  >
                    {selectedSignalement.statut}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedSignalement.description}
                  </p>
                </CardContent>
              </Card>

              {/* Informations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date de création
                      </p>
                      <p className="font-medium mt-1">
                        {new Date(
                          selectedSignalement.dateCreation
                        ).toLocaleString("fr-FR")}
                      </p>
                    </div>
                    {selectedSignalement.dateResolution && (
                      <div>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date de résolution
                        </p>
                        <p className="font-medium mt-1">
                          {new Date(
                            selectedSignalement.dateResolution
                          ).toLocaleString("fr-FR")}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Auteur
                      </p>
                      <p className="font-medium mt-1">
                        {selectedSignalement.auteur}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Accompagnateur
                      </p>
                      <p className="font-medium mt-1">
                        {selectedSignalement.accompagnateur}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-orange-600" />
              Changer le Statut
            </DialogTitle>
            <DialogDescription>
              Modifier le statut du signalement{" "}
              {selectedSignalement?.groupe.name}
            </DialogDescription>
          </DialogHeader>

          {selectedSignalement && (
            <div className="space-y-4">
              {/* Informations du signalement */}

              {/* Sélecteur de statut */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Nouveau statut
                </label>
                <Select
                  disabled={isLoading}
                  value={newStatus}
                  onValueChange={setNewStatus}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Urgent">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        Urgent
                      </div>
                    </SelectItem>
                    <SelectItem value="En cours">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        En cours
                      </div>
                    </SelectItem>
                    <SelectItem value="Resolu">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Résolu
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Boutons d'action */}
              <div className="flex items-center gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStatusDialogOpen(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  disabled={isLoading}
                  onClick={handleSaveStatus}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                >
                  {isLoading ? (
                    <>
                      Enregistrement
                      <Spinner variant="ellipsis" />
                    </>
                  ) : (
                    <>
                      Enregistrer
                      <RefreshCw className="h-4 w-4 mr-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
