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
} from "lucide-react";
import { PurchaseDetail } from "@/core/lib/types";
import { useModal } from "@/core/providers/modal-provider";
import CustomModal from "@/core/components/wrappeds/custom-modal";
import { PurchaseForm } from "@/core/view/purchase/purchase-form";
import { DataTable } from "@/core/components/global/data-table";
import { useMyData } from "@/core/hooks/store";

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
    return (
      <DialogContent className="!max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-emerald-600" />
            Détails de l'Achat #{purchase.id.slice(0, 8)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Purchase Summary */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg">
            <div>
              <h3 className="font-semibold text-lg">
                {purchase.accompaniment.name}
              </h3>
              <p className="text-sm text-gray-600">
                {purchase.accompaniment.project?.name || "Aucun projet"}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-600">
                {purchase.total.toLocaleString()} DJF
              </div>
              <div className="text-sm text-gray-500">
                {new Date(purchase.createdAt).toLocaleDateString("fr-FR")}
              </div>
            </div>
          </div>

          {/* Accompaniment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Informations de l'Accompagnement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {purchase.accompaniment.adresse}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {purchase.accompaniment.phones.join(", ")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    Budget: {purchase.accompaniment.budget.toLocaleString()} DJF
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Membres de l'accompagnement:
                </p>
                <div className="flex flex-wrap gap-2">
                  {purchase.accompaniment.members.map((member: any) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={member.profile || "/placeholder.svg"}
                          alt={member.name}
                        />
                        <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                          {member.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-600" />
                Articles Achetés ({purchase.purchaseItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {purchase.purchaseItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <Avatar className="h-16 w-16 rounded-md">
                      <AvatarImage
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 rounded-md">
                        <Package className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <div className="space-y-1 text-xs text-gray-600">
                        <p>
                          Prix unitaire:{" "}
                          {Number.parseInt(item.price).toLocaleString()} DJF
                        </p>
                        <p>Quantité: {item.quantity}</p>
                        <p>
                          Date:{" "}
                          {new Date(item.date).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div className="mt-2">
                        <span className="font-bold text-emerald-600">
                          Total:{" "}
                          {(
                            Number.parseInt(item.price) * item.quantity
                          ).toLocaleString()}{" "}
                          DJF
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Purchase Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chronologie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Achat créé</p>
                    <p className="text-xs text-gray-500">
                      {new Date(purchase.createdAt).toLocaleDateString("fr-FR")}{" "}
                      à{" "}
                      {new Date(purchase.createdAt).toLocaleTimeString("fr-FR")}
                    </p>
                  </div>
                </div>
                {purchase.updatedAt !== purchase.createdAt && (
                  <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        Dernière modification
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(purchase.updatedAt).toLocaleDateString(
                          "fr-FR"
                        )}{" "}
                        à{" "}
                        {new Date(purchase.updatedAt).toLocaleTimeString(
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
    <section className="space-y-6 p-6 ">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Achats</h2>
        <Button
          onClick={() =>
            open(
              <CustomModal>
                <PurchaseForm userId={user.id} admin="non" />
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
      {allPurchases.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun achat enregistré
            </h3>
            <p className="text-gray-500 mb-4">
              Commencez par enregistrer votre premier achat.
            </p>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Enregistrer un Achat
            </Button>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
