"use client";

import { useGetOperation } from "@/core/hooks/use-accompaniment";

import { useMemo, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Badge } from "@/core/components/ui/badge";
import { Input } from "@/core/components/ui/input";
import {
  Search,
  MapPin,
  Phone,
  ShoppingCart,
  User,
  Calendar,
  Package,
  ChevronRight,
  Mail,
  FileText,
  X,
  ImageIcon,
  Receipt,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import { Button } from "@/core/components/ui/button";
import { Spinner } from "@/core/components/ui/spinner";

export function OperationBody() {
  const { data, isPending } = useGetOperation();

  const [selectedOperation, setSelectedOperation] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  // Filtrer les opérations par nom
  const filteredOperations = useMemo(() => {
    return (data ?? []).filter((op: any) =>
      op.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);
  // Calculer le total des achats
  const getTotalPurchases = (purchases: any[]) => {
    return purchases.reduce((sum, purchase) => sum + purchase.total, 0);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Panneau gauche - Liste des opérations */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Barre de recherche */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-br from-white to-gray-50">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-teal-500 transition-colors" />
            <Input
              placeholder="Rechercher une opération..."
              className="pl-10 pr-4 bg-white border-gray-300 hover:border-teal-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {filteredOperations.length} opération
            {filteredOperations.length > 1 ? "s" : ""} trouvée
            {filteredOperations.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Liste scrollable */}
        <div className="flex-1 overflow-y-auto p-3">
          {isPending ? (
            <div className="h-[600px] flex justify-center items-center">
              <Spinner variant="bars" className="text-primary" size={80} />
            </div>
          ) : (
            filteredOperations.map((operation: any) => (
              <div
                key={operation.id}
                onClick={() => setSelectedOperation(operation)}
                className={`p-4 mb-2 rounded-xl cursor-pointer transition-all duration-300 group relative ${
                  selectedOperation?.id === operation.id
                    ? "bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-400"
                    : "bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 border border-gray-200 hover:border-teal-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3
                      className={`font-bold text-sm mb-1 ${
                        selectedOperation?.id === operation.id
                          ? "text-teal-800"
                          : "text-gray-800"
                      }`}
                    >
                      {operation.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                      <MapPin className="h-3 w-3" />
                      <span>{operation.adresse}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {operation.budget.toLocaleString()} Fdj
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        {operation.purchases?.length || 0}
                      </Badge>
                    </div>
                  </div>
                  <ChevronRight
                    className={`h-5 w-5 transition-all ${
                      selectedOperation?.id === operation.id
                        ? "text-teal-600 translate-x-1"
                        : "text-gray-400 group-hover:text-teal-500 group-hover:translate-x-1"
                    }`}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Panneau droit - Détails de l'opération */}
      <div className="flex-1 overflow-y-auto p-2">
        {selectedOperation ? (
          <div className="  space-y-6">
            {/* En-tête de l'opération */}
            <Card className="border-2 border-teal-200 bg-gradient-to-br from-white to-teal-50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl text-teal-800 mb-2">
                      {selectedOperation.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedOperation.adresse}</span>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                    {selectedOperation.st}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-teal-200">
                    <div className="flex items-center gap-2 text-teal-600 mb-1">
                      <span className="text-sm font-medium">Budget</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      {selectedOperation.budget.toLocaleString()} Fdj
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <ShoppingCart className="h-5 w-5" />
                      <span className="text-sm font-medium">Achats</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      {selectedOperation.purchases?.length || 0}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-2 text-purple-600 mb-1">
                      <Package className="h-5 w-5" />
                      <span className="text-sm font-medium">Total Dépensé</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      {getTotalPurchases(
                        selectedOperation.purchases || []
                      ).toLocaleString()}{" "}
                      Fdj
                    </p>
                  </div>
                  {selectedOperation.file && (
                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                      <div className="flex items-center gap-2 text-orange-600 mb-1">
                        <FileText className="h-5 w-5" />
                        <span className="text-sm font-medium">Fichier</span>
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedFileUrl(selectedOperation.file.url);
                          setFileDialogOpen(true);
                        }}
                        className="mt-1 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs h-8"
                      >
                        Voir
                      </Button>
                    </div>
                  )}
                </div>
                {selectedOperation.phones &&
                  selectedOperation.phones.length > 0 && (
                    <div className="mt-4 flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">
                        {selectedOperation.phones.join(", ")}
                      </span>
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Informations de l'utilisateur */}
            {selectedOperation.users && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-teal-600" />
                    Accompagnateur
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 ring-2 ring-teal-500 ring-offset-2">
                      <AvatarImage src={selectedOperation.users.profile} />
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-600 text-white font-bold text-lg">
                        {selectedOperation.users.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">
                        {selectedOperation.users.name}
                      </h3>
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{selectedOperation.users.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{selectedOperation.users.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{selectedOperation.users.address}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Badge variant="outline" className="capitalize">
                          {selectedOperation.users.gender}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {selectedOperation.users.type}
                        </Badge>
                        <Badge
                          className={
                            selectedOperation.users.status === "enabled"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {selectedOperation.users.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fichier et Achats côte à côte */}
            <div className="grid grid-cols-2 gap-2">
              {/* Fichier à gauche */}
              {selectedOperation.file && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-orange-600" />
                        Fichier
                      </div>
                      <a
                        href={selectedOperation.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        Ouvrir dans un nouvel onglet
                      </a>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="!p-0">
                    <div className="space-y-3 ">
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100  p-3 border border-orange-200 px-5">
                        <p className="font-medium text-sm text-gray-800">
                          {selectedOperation.file.name}
                        </p>
                      </div>
                      {/* Iframe pour afficher le fichier */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <iframe
                          src={
                            selectedOperation.file.type?.includes("pdf")
                              ? selectedOperation.file.url
                              : `https://docs.google.com/viewer?url=${encodeURIComponent(
                                  selectedOperation.file.url
                                )}&embedded=true`
                          }
                          className="w-full h-[500px]"
                          title={selectedOperation.file.name}
                          frameBorder="0"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Achats à droite */}
              {selectedOperation.purchases &&
                selectedOperation.purchases.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <ShoppingCart className="h-5 w-5 text-blue-600" />
                        Achats ({selectedOperation.purchases.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {selectedOperation.purchases.map((purchase: any) => (
                          <div
                            key={purchase.id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  {new Date(
                                    purchase.createdAt
                                  ).toLocaleDateString("fr-FR")}
                                </span>
                              </div>
                              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                {purchase.total.toLocaleString()} Fdj
                              </Badge>
                            </div>

                            {purchase.purchaseItems &&
                              purchase.purchaseItems.length > 0 && (
                                <div className="space-y-2">
                                  {purchase.purchaseItems.map((item: any) => (
                                    <div
                                      key={item.id}
                                      className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                      {item.image && (
                                        <div
                                          onClick={() => {
                                            setSelectedItem(item);
                                            setImageDialogOpen(true);
                                          }}
                                          className="cursor-pointer relative group"
                                        >
                                          <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-all"
                                          />
                                        </div>
                                      )}
                                      <div className="flex-1">
                                        <p className="font-medium text-sm text-gray-800">
                                          {item.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          Quantité: {item.quantity} ×{" "}
                                          {item.price} Fdj
                                        </p>
                                        {item.facture && (
                                          <Button
                                            variant="link"
                                            size="sm"
                                            onClick={() => {
                                              setSelectedItem(item);
                                              setImageDialogOpen(true);
                                            }}
                                            className="h-auto p-0 text-xs text-blue-600 hover:text-blue-800"
                                          >
                                            <Receipt className="h-3 w-3 mr-1" />
                                            Voir facture
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">
                Aucune opération sélectionnée
              </h3>
              <p className="text-gray-500">
                Sélectionnez une opération dans la liste pour voir les détails
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Dialog pour afficher le fichier */}
      <Dialog open={fileDialogOpen} onOpenChange={setFileDialogOpen}>
        <DialogContent className="max-w-6xl h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                Fichier de l'opération
              </div>
              {selectedOperation?.file && (
                <a
                  href={selectedOperation.file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Ouvrir dans un nouvel onglet
                </a>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 h-[calc(90vh-100px)]">
            {selectedFileUrl && (
              <iframe
                src={
                  selectedOperation?.file?.type?.includes("pdf")
                    ? selectedFileUrl
                    : `https://docs.google.com/viewer?url=${encodeURIComponent(
                        selectedFileUrl
                      )}&embedded=true`
                }
                className="w-full h-full rounded-lg border border-gray-200"
                title="Fichier de l'opération"
                frameBorder="0"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour afficher l'image et la facture */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="!max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-blue-600" />
              {selectedItem?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6">
              {/* Informations de l'article */}
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Article</p>
                      <p className="font-medium text-gray-900">
                        {selectedItem.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Quantité</p>
                      <p className="font-medium text-gray-900">
                        {selectedItem.quantity}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Prix unitaire</p>
                      <p className="font-medium text-gray-900">
                        {selectedItem.price} Fdj
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Images côte à côte */}
              <div className="grid grid-cols-2 gap-4">
                {/* Image du produit */}
                {selectedItem.image && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-blue-600" />
                        Image du produit
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative group">
                        <img
                          src={selectedItem.image}
                          alt={selectedItem.name}
                          className="w-full h-auto rounded-lg border border-gray-200"
                        />
                        <a
                          href={selectedItem.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white px-3 py-1 rounded-lg text-xs text-blue-600 hover:text-blue-800 shadow-md transition-all"
                        >
                          Ouvrir en grand
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Facture */}
                {selectedItem.facture && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-green-600" />
                        Facture
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative group">
                        <img
                          src={selectedItem.facture}
                          alt="Facture"
                          className="w-full h-auto rounded-lg border border-gray-200"
                        />
                        <a
                          href={selectedItem.facture}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white px-3 py-1 rounded-lg text-xs text-green-600 hover:text-green-800 shadow-md transition-all"
                        >
                          Ouvrir en grand
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Date */}
              {selectedItem.date && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Date:{" "}
                    {new Date(selectedItem.date).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
