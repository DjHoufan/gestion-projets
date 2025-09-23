"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/core/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import {
  FileText,
  CheckCircle,
  XCircle,
  ImageIcon,
  Eye,
  Download,
  Edit,
  User,
  Calendar,
  CreditCard,
  Phone,
  MapPin,
} from "lucide-react";
import { EmargementDetail } from "@/core/lib/types";
import { DataTable } from "@/core/components/global/data-table";
import { EmargementForm } from "@/core/view/rapports/form/emargement-form";

import { useModal } from "@/core/providers/modal-provider";
import { useMyData } from "@/core/hooks/store";

export function EmargementsView() {
  const { open, close } = useModal();

  const { data: user } = useMyData();

  if (!user) {
    return <div>Chargement...</div>;
  }

  const signedEmargements = user.emargements.filter((em: any) => em.signature);
  const unsignedEmargements = user.emargements.filter(
    (em: any) => !em.signature
  );
  const totalAmount = user.emargements.reduce(
    (acc: number, em: any) => acc + em.montant,
    0
  );

  const columns = [
    {
      id: "id",
      header: "ID",
      cell: ({ row }: any) => (
        <span className="font-mono text-xs">
          #{row.original.id.slice(0, 8)}
        </span>
      ),
      size: 100,
    },
    {
      id: "member",
      header: "Membre",
      cell: ({ row }: any) => {
        const member = row.original.member;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={member?.profile || "/placeholder.svg"}
                alt={member?.name}
              />
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                {member?.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("") || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">
                {member?.name || "N/A"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {member?.email || ""}
              </p>
            </div>
          </div>
        );
      },
      size: 250,
    },
    {
      id: "cni",
      header: "CNI",
      cell: ({ row }: any) => (
        <span className="font-mono text-sm">{row.original.cni}</span>
      ),
      size: 150,
    },
    {
      id: "date",
      header: "Date",
      cell: ({ row }: any) => (
        <span className="text-sm">
          {new Date(row.original.date).toLocaleDateString("fr-FR")}
        </span>
      ),
      size: 120,
    },
    {
      id: "montant",
      header: "Montant",
      cell: ({ row }: any) => (
        <span className="font-semibold text-emerald-600">
          {row.original.montant.toLocaleString()} DJF
        </span>
      ),
      size: 120,
    },
    {
      id: "status",
      header: "Statut",
      cell: ({ row }: any) => {
        const hasSignature = row.original.signature;
        return (
          <Badge
            variant={hasSignature ? "default" : "secondary"}
            className={
              hasSignature
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-700"
            }
          >
            {hasSignature ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" /> Signé
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3 mr-1" /> Non signé
              </>
            )}
          </Badge>
        );
      },
      size: 150,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const emargement = row.original;
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
              <EmargementDetailsModal emargement={emargement} />
            </Dialog>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-transparent"
              onClick={() =>
                open(
                  <EmargementForm
                    details={emargement}
                    open={true}
                    onOpenChangeAction={close}
                    userId={user.id}
                  />
                )
              }
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        );
      },
      size: 180,
    },
  ];

  const EmargementDetailsModal = ({ emargement }: { emargement: any }) => {
    return (
      <DialogContent className="!max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            Détails de l'Émargement #{emargement.id.slice(0, 8)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Amount */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg">
            <Badge
              variant={emargement.signature ? "default" : "secondary"}
              className={`${
                emargement.signature
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
              } px-4 py-2`}
            >
              {emargement.signature ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" /> Émargement Signé
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" /> En Attente de Signature
                </>
              )}
            </Badge>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-600">
                {emargement.montant.toLocaleString()} DJF
              </div>
              <div className="text-sm text-gray-500">
                {new Date(emargement.date).toLocaleDateString("fr-FR")}
              </div>
            </div>
          </div>

          {/* Member Information */}
          {emargement.member && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Informations du Membre
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-6">
                  <Avatar className="h-20 w-20 border-2 border-emerald-200">
                    <AvatarImage
                      src={emargement.member.profile || "/placeholder.svg"}
                      alt={emargement.member.name}
                    />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xl">
                      {emargement.member.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-lg text-gray-900">
                          {emargement.member.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {emargement.member.email}
                        </p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{emargement.member.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{emargement.member.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>
                            Né(e) le{" "}
                            {new Date(emargement.member.dob).toLocaleDateString(
                              "fr-FR"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Formation
                        </p>
                        <p className="text-sm text-gray-600">
                          {emargement.member.formation}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Centre
                        </p>
                        <p className="text-sm text-gray-600">
                          {emargement.member.center}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Genre
                        </p>
                        <p className="text-sm text-gray-600 capitalize">
                          {emargement.member.gender}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Document Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  Informations du Document
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">CNI</p>
                    <p className="font-mono font-medium bg-gray-100 px-3 py-2 rounded text-sm">
                      {emargement.cni}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Montant</p>
                    <p className="font-bold text-emerald-600 text-lg">
                      {emargement.montant.toLocaleString()} DJF
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Date</p>
                    <p className="text-sm">
                      {new Date(emargement.date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Heure</p>
                    <p className="text-sm">
                      {new Date(emargement.date).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-orange-600" />
                  Reçu de paiement
                </CardTitle>
              </CardHeader>
              <CardContent>
                {emargement.PhotoCni ? (
                  <div className="space-y-3">
                    <img
                      src={emargement.PhotoCni || "/placeholder.svg"}
                      alt="Reçu de paiement"
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                    >
                      <Download className="h-3 w-3 mr-2" />
                      Télécharger l'image
                    </Button>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                    <span className="text-gray-500 text-sm">
                      Aucune photo disponible
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Observations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Observations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm leading-relaxed">
                  {emargement.observations || (
                    <span className="italic text-gray-500">
                      Aucune observation particulière
                    </span>
                  )}
                </p>
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
        <h2 className="text-2xl font-bold text-gray-900">Émargements</h2>
        <Button
          onClick={() =>
            open(
              <EmargementForm
                open={true}
                onOpenChangeAction={close}
                userId={user.id}
              />
            )
          }
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Nouvel Émargement
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-100 rounded-full -mr-10 -mt-10"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Émargements
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {user.emargements.length}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <FileText className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -mr-10 -mt-10"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Signés</p>
                <p className="text-3xl font-bold text-gray-900">
                  {signedEmargements.length}
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
                  En Attente
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {unsignedEmargements.length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <XCircle className="h-6 w-6 text-orange-600" />
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
                  Montant Total
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalAmount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">DJF</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emargements Table */}
      <DataTable<Partial<EmargementDetail> & { id: string }>
        data={user.emargements ? user.emargements : []}
        columns={columns}
        searchPlaceholder="Rechercher par nom ou date..."
        searchField="name"
        additionalSearchFields={["phone", "email", "status"]}
        title="des achats"
        description="Gérez les informations et les dépenses de vos différents accompagnements"
        canAdd={false}
        pageSize={10}
        addButtonText="Enregistre un nouveau bénéficiaires"
        isPending={user.emargements ? false : true}
      />

      {user.emargements.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun émargement enregistré
            </h3>
            <p className="text-gray-500 mb-4">
              Commencez par créer votre premier émargement.
            </p>
            <Button
              onClick={() =>
                open(
                  <EmargementForm
                    open={true}
                    onOpenChangeAction={close}
                    userId={user.id}
                  />
                )
              }
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Créer un Émargement
            </Button>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
