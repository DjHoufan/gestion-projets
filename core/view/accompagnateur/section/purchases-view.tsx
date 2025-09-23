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
  ShoppingCart,
  Package,
  Users,
  Eye,
  Edit,
  MapPin,
  Phone,
  Banknote,
  Calendar,
  Hash,
  Download,
} from "lucide-react";
import { PurchaseDetail } from "@/core/lib/types";
import { useModal } from "@/core/providers/modal-provider";
import CustomModal from "@/core/components/wrappeds/custom-modal";
import { PurchaseForm } from "@/core/view/purchase/purchase-form";
import { DataTable } from "@/core/components/global/data-table";
import { useMyData } from "@/core/hooks/store";
import { useState } from "react";

export function PurchasesView() {
  const { open } = useModal();

  const { data: user } = useMyData();

  if (!user) {
    return <div>Chargement...</div>;
  }

  // Flatten all purchases with accompaniment info
  const allPurchases = user.accompaniments.flatMap(
    (acc: any) =>
      acc.purchases?.map((purchase: any) => ({
        ...purchase,
        accompaniment: acc,
      })) || []
  );

  const grandTotal = allPurchases.reduce(
    (sum: number, purchase: any) => sum + purchase.total,
    0
  );
  const totalItems = allPurchases.reduce(
    (sum: number, purchase: any) => sum + purchase.purchaseItems.length,
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
      size: 120,
    },
    {
      id: "accompaniment",
      header: "Accompagnement",
      cell: ({ row }: any) => {
        const accompaniment = row.original.accompaniment;
        return (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-600" />
            <div>
              <p className="font-medium text-sm">{accompaniment.name}</p>
              <p className="text-xs text-gray-500">
                {accompaniment.members.length} membres
              </p>
            </div>
          </div>
        );
      },
      size: 200,
    },
    {
      id: "project",
      header: "Projet",
      cell: ({ row }: any) => {
        const project =
          row.original.accompaniment.project?.name || "Aucun projet";
        return (
          <Badge
            variant="secondary"
            className="bg-emerald-100 text-emerald-700"
          >
            {project}
          </Badge>
        );
      },
      size: 150,
    },
    {
      id: "articles",
      header: "Articles",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-gray-500" />
          <span className="text-sm">
            {row.original.purchaseItems.length} article(s)
          </span>
        </div>
      ),
      size: 150,
    },
    {
      id: "total",
      header: "Total",
      cell: ({ row }: any) => (
        <span className="font-semibold text-emerald-600">
          {row.original.total.toLocaleString()} DJF
        </span>
      ),
      size: 120,
    },
    {
      id: "date",
      header: "Date",
      cell: ({ row }: any) => (
        <span className="text-sm">
          {new Date(row.original.createdAt).toLocaleDateString("fr-FR")}
        </span>
      ),
      size: 120,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const purchase = row.original;
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
              <PurchaseDetailsModal purchase={purchase} />
            </Dialog>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-transparent"
              onClick={() =>
                open(
                  <CustomModal>
                    <PurchaseForm details={purchase} />
                  </CustomModal>
                )
              }
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        );
      },
      size: 150,
    },
  ];

  const PurchaseDetailsModal = ({ purchase }: { purchase: any }) => {
  

    const downloadImage = async (imageUrl: string, filename: string) => {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Erreur lors du téléchargement:", error);
      }
    };

    return (
      <>
        <DialogContent className="!max-w-6xl max-h-[90vh] overflow-y-auto bg-background border-border">
          <DialogHeader className="border-b border-border pb-6">
            <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-emerald-400" />
              </div>
              Détails de l'Achat
              <span className="text-muted-foreground font-mono text-lg">
                #{purchase.id.slice(0, 8)}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 1: Accompaniment Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                    1
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Informations de l'Accompagnement
                  </h2>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {purchase.accompaniment.name}
                      </h3>
                      <p className="text-muted-foreground">
                        {purchase.accompaniment.project?.name || "Aucun projet"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        Budget total
                      </div>
                      <div className="text-lg font-bold text-emerald-400">
                        {purchase.accompaniment.budget.toLocaleString()} DJF
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                      <MapPin className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-foreground">
                        {purchase.accompaniment.adresse}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                      <Phone className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-foreground">
                        {purchase.accompaniment.phones.join(", ")}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-3">
                      Membres de l'équipe
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {purchase.accompaniment.members.map((member: any) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 bg-secondary/50 rounded-full px-3 py-2"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={member.profile || "/placeholder.svg"}
                              alt={member.name}
                            />
                            <AvatarFallback className="bg-emerald-500/20 text-emerald-400 text-xs">
                              {member.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-foreground">
                            {member.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Purchase Items */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                    2
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Articles Achetés
                  </h2>
                  <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs font-medium">
                    {purchase.purchaseItems.length} article
                    {purchase.purchaseItems.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-6">
                  {purchase.purchaseItems.map((item: any, index: number) => (
                    <div
                      key={item.id}
                      className="bg-card border border-border rounded-xl overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                              <Package className="h-5 w-5 text-orange-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg text-foreground">
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(item.date).toLocaleDateString(
                                    "fr-FR"
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Hash className="h-3 w-3" />
                                  Qté: {item.quantity}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-400">
                              {(
                                Number.parseInt(item.price) * item.quantity
                              ).toLocaleString()}{" "}
                              DJF
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {Number.parseInt(item.price).toLocaleString()} DJF
                              × {item.quantity}
                            </div>
                          </div>
                        </div>

                        {/* Images Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <span className="text-sm font-medium text-muted-foreground">
                                Photo du Produit
                              </span>
                            </div>
                            <div className="relative group">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={`Photo de ${item.name}`}
                                className="w-full h-48 object-cover rounded-lg border border-border transition-all"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src =
                                    "/diverse-products-still-life.png";
                                }}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-lg transition-all flex items-center justify-center gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 backdrop-blur-sm border border-border hover:bg-background"
                                  onClick={() =>
                                    downloadImage(
                                      item.image ||
                                        "/diverse-products-still-life.png",
                                      `produit-${item.name.replace(
                                        /\s+/g,
                                        "-"
                                      )}-${item.id.slice(0, 8)}.jpg`
                                    )
                                  }
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                              <span className="text-sm font-medium text-muted-foreground">
                                Facture
                              </span>
                            </div>
                            <div className="relative group">
                              <img
                                src={item.facture || "/placeholder.svg"}
                                alt={`Facture de ${item.name}`}
                                className="w-full h-48 object-cover rounded-lg border border-border transition-all"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/business-invoice.png";
                                }}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-lg transition-all flex items-center justify-center gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 backdrop-blur-sm border border-border hover:bg-background"
                                  onClick={() =>
                                    downloadImage(
                                      item.facture || "/business-invoice.png",
                                      `facture-${item.name.replace(
                                        /\s+/g,
                                        "-"
                                      )}-${item.id.slice(0, 8)}.jpg`
                                    )
                                  }
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Order Summary */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  Résumé de l'Achat
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground">
                      Date de création
                    </span>
                    <span className="text-foreground font-medium">
                      {new Date(purchase.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground">
                      Nombre d'articles
                    </span>
                    <span className="text-foreground font-medium">
                      {purchase.purchaseItems.length}
                    </span>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-foreground">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-emerald-400">
                        {purchase.total.toLocaleString()} DJF
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mt-8 pt-6 border-t border-border">
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">
                    Chronologie
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Achat créé
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(purchase.createdAt).toLocaleDateString(
                            "fr-FR"
                          )}{" "}
                          à{" "}
                          {new Date(purchase.createdAt).toLocaleTimeString(
                            "fr-FR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    {purchase.updatedAt !== purchase.createdAt && (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Dernière modification
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(purchase.updatedAt).toLocaleDateString(
                              "fr-FR"
                            )}{" "}
                            à{" "}
                            {new Date(purchase.updatedAt).toLocaleTimeString(
                              "fr-FR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </>
    );
  };

  return (
    <section className="space-y-6 p-6 ">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Achats</h2>
        <Button
          onClick={() =>
            open(
              <CustomModal>
                <PurchaseForm />
              </CustomModal>
            )
          }
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Nouveau Achat
        </Button>
      </div>

      {/* Global Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-100 rounded-full -mr-10 -mt-10"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Transactions
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {allPurchases.length}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <ShoppingCart className="h-6 w-6 text-emerald-600" />
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
                  Montant Total
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {grandTotal.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">DJF</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Banknote className="h-6 w-6 text-green-600" />
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
                  Articles Achetés
                </p>
                <p className="text-3xl font-bold text-gray-900">{totalItems}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
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
                  Accompagnements
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {user.accompaniments.length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchases Table */}

      <DataTable<PurchaseDetail>
        data={allPurchases ? allPurchases : []}
        columns={columns}
        searchPlaceholder="Rechercher par nom ou date..."
        searchField="name"
        additionalSearchFields={["phone", "email", "status"]}
        title="des achats"
        description="Gérez les informations et les dépenses de vos différents accompagnements"
        canAdd={false}
        pageSize={10}
        addButtonText="Enregistre un nouveau bénéficiaires"
        isPending={allPurchases ? false : true}
      />
    </section>
  );
}
