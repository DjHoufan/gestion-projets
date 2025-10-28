"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/core/components/ui/card";
import { Input } from "@/core/components/ui/input";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import {
  Search,
  Mail,
  Phone,
  UserCheck,
  Users,
  ChevronRight,
  Building2,
  ShoppingCart,
  Calendar,
  CheckCircle2,
  MapPin,
  FileText,
  X,
  MessageSquare,
  UserCircle,
  ClipboardList,
  FileCheck,
  AlertTriangle,
  Scale,
} from "lucide-react";

import { useSupervision } from "@/core/contexts/SupervisionContext";
import { Spinner } from "@/core/components/ui/spinner";
import { UsGetDataForSuperviseur } from "@/core/hooks/use-superivision";

export function SuperiviseurBody({ id }: { id: string }) {
  const { data: supervisionData, isPending } = UsGetDataForSuperviseur(id);

  const [searchTerm, setSearchTerm] = useState("");
  const { selectedAccompanist, setSelectedAccompanist } = useSupervision();
  const [selectedAccompaniment, setSelectedAccompaniment] = useState<any>(null);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [singlePurchaseDialogOpen, setSinglePurchaseDialogOpen] =
    useState(false);
  const [selectedRencontre, setSelectedRencontre] = useState<any>(null);
  const [rencontreDialogOpen, setRencontreDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedConflit, setSelectedConflit] = useState<any>(null);
  const [conflitDialogOpen, setConflitDialogOpen] = useState(false);
  const router = useRouter();

  const filteredAccompanists = useMemo(() => {
    if (!supervisionData?.supervision) {
      return [];
    }

    return supervisionData.supervision.filter(
      (acc: any) =>
        acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [supervisionData, searchTerm]);

  const handleAccompanistClick = (accompanist: any) => {
    setSelectedAccompanist(accompanist);
    setSelectedAccompaniment(null);
  };

  // Fonction pour trouver la rencontre associée à une visite
  const getRencontreForVisit = (visitId: string) => {
    if (!selectedAccompaniment?.rencontre) return null;
    return selectedAccompaniment.rencontre.find(
      (r: any) => r.visitId === visitId
    );
  };

  // Statistiques de l'accompagnement sélectionné
  const accompanimentStats = useMemo(() => {
    if (!selectedAccompaniment) return null;

    return {
      beneficiaries: selectedAccompaniment.members?.length || 0,
      purchases: selectedAccompaniment.purchases?.length || 0,
      budget: selectedAccompaniment.budget || 0,
      visits: selectedAccompaniment.planning?.visit?.length || 0,
      meetings: selectedAccompaniment.rencontre?.length || 0,
      conflits: selectedAccompaniment.conflits?.length || 0,
    };
  }, [selectedAccompaniment]);

  console.log({filteredAccompanists});
  
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Panneau gauche moderne - Liste des accompagnateurs */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Barre de recherche */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-br from-white to-gray-50">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-teal-500 transition-colors" />
            <Input
              placeholder="Rechercher un accompagnateur..."
              className="pl-10 pr-4 bg-white border-gray-300 hover:border-teal-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <Users className="h-3 w-3" />
            {filteredAccompanists.length} accompagnateur
            {filteredAccompanists.length > 1 ? "s" : ""}
          </p>
        </div>



        {/* Liste scrollable moderne */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
          {isPending ? (
            <div className="flex justify-center items-center">
              <Spinner variant="bars" className="text-primary" size={56} />
            </div>
          ) : (
            filteredAccompanists.map((accompanist: any, index: number) => (
              <div
                key={accompanist.id}
                onClick={() => handleAccompanistClick(accompanist)}
                className={`p-4 mb-2 rounded-xl cursor-pointer transition-all duration-300 group relative ${
                  selectedAccompanist?.id === accompanist.id
                    ? "bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-400"
                    : "bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 border border-gray-200 hover:border-teal-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar
                      className={`h-12 w-12 ring-2 ring-offset-2 transition-all ${
                        selectedAccompanist?.id === accompanist.id
                          ? "ring-teal-500"
                          : "ring-gray-300 group-hover:ring-teal-400"
                      }`}
                    >
                      <AvatarImage src={accompanist.profile} />
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-600 text-white font-bold text-sm">
                        {accompanist.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    {/* Badge de statut */}
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white transition-all ${
                        selectedAccompanist?.id === accompanist.id
                          ? "bg-teal-500"
                          : "bg-green-500 group-hover:bg-teal-400"
                      }`}
                    ></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-semibold truncate text-sm transition-colors ${
                        selectedAccompanist?.id === accompanist.id
                          ? "text-teal-900"
                          : "text-gray-800 group-hover:text-teal-700"
                      }`}
                    >
                      {accompanist.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Mail
                        className={`h-3 w-3 transition-colors ${
                          selectedAccompanist?.id === accompanist.id
                            ? "text-teal-600"
                            : "text-gray-400 group-hover:text-teal-500"
                        }`}
                      />
                      <p
                        className={`text-xs truncate transition-colors ${
                          selectedAccompanist?.id === accompanist.id
                            ? "text-teal-700"
                            : "text-gray-500 group-hover:text-gray-700"
                        }`}
                      >
                        {accompanist.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats en bas */}
                <div className="mt-3 flex items-center justify-between text-xs">
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                      selectedAccompanist?.id === accompanist.id
                        ? "bg-teal-100 text-teal-700 border border-teal-300"
                        : "bg-gray-100 text-gray-600 border border-gray-200 group-hover:bg-teal-50 group-hover:text-teal-600 group-hover:border-teal-200"
                    }`}
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    <span className="font-semibold">
                      {accompanist.accompaniments?.length || 0}
                    </span>
                  </div>

                  <Badge
                    variant="outline"
                    className={`transition-all font-semibold ${
                      selectedAccompanist?.id === accompanist.id
                        ? "bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700 border-teal-300"
                        : "bg-gray-100 text-gray-600 border-gray-300 group-hover:bg-gradient-to-r group-hover:from-teal-50 group-hover:to-blue-50 group-hover:text-teal-600 group-hover:border-teal-300"
                    }`}
                  >
                    💰{" "}
                    {Math.round(
                      (accompanist.accompaniments?.reduce(
                        (s: number, a: any) => s + (a.budget || 0),
                        0
                      ) || 0) / 1000
                    )}
                    K
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Style pour la scrollbar moderne */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #14b8a6, #0d9488);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0d9488, #0f766e);
        }
      `}</style>

      {/* Panneau central - Accompagnements */}
      <div className="flex-1 flex flex-col">
        {!selectedAccompanist ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Users className="h-16 w-16 mx-auto mb-4" />
              <p>Sélectionnez un accompagnateur</p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-6 border-b bg-white">
              <div className="flex justify-between items-center gap-5">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedAccompanist.profile} />
                    <AvatarFallback>
                      {selectedAccompanist.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">
                      {selectedAccompanist.name}
                    </h2>
                    <div className="flex gap-4 mt-1 text-sm text-gray-500">
                      <span>
                        <Mail className="h-3 w-3 inline" />{" "}
                        {selectedAccompanist.email}
                      </span>
                      <span>
                        <Phone className="h-3 w-3 inline" />{" "}
                        {selectedAccompanist.phone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center  justify-center gap-4 mb-4">
                  <div className="flex-1">
                    <label className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-700">
                      <Building2 className="h-4 w-4 text-teal-600" />
                      Sélectionner un accompagnement
                    </label>
                    <Select
                      value={selectedAccompaniment?.id || ""}
                      onValueChange={(value) => {
                        const acc = selectedAccompanist.accompaniments?.find(
                          (a: any) => a.id === value
                        );
                        setSelectedAccompaniment(acc || null);
                      }}
                    >
                      <SelectTrigger className="w-full h-12 bg-gradient-to-r from-teal-600/20 to-teal-600/20 border-2 border-teal-500/30 hover:border-teal-500 focus:border-teal-600 transition-all">
                        <SelectValue
                          placeholder="Choisissez un accompagnement..."
                          className="text-gray-700 font-medium"
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-teal-500/30">
                        {selectedAccompanist.accompaniments?.map((acc: any) => (
                          <SelectItem
                            key={acc.id}
                            value={acc.id}
                            className="hover:bg-gradient-to-r hover:from-teal-50 hover:to-teal-100/50 cursor-pointer transition-all my-1 rounded-md focus:bg-teal-50"
                          >
                            <div className="flex items-center gap-3 py-1">
                              <div className="p-1.5 bg-teal-100 rounded-md">
                                <Building2 className="h-4 w-4 text-teal-600" />
                              </div>
                              <span className="font-medium text-gray-700">
                                {acc.name}
                              </span>
                              <Badge
                                variant="outline"
                                className="ml-auto bg-teal-50 text-teal-700 border-teal-300 font-semibold"
                              >
                                💰 {Math.round(acc.budget / 1000)}K FDJ
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={() =>
                      router.push(
                        `/accompagnementSup/${selectedAccompaniment.id}`
                      )
                    }
                    className="self-end"
                  >
                    Voir les détails
                  </Button>
                </div>
              </div>

              {selectedAccompaniment && (
                <div className="grid grid-cols-6 gap-3">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {accompanimentStats?.beneficiaries || 0}
                    </p>
                    <p className="text-xs text-gray-500">Bénéficiaires</p>
                  </div>
                  <div
                    className="text-center p-3 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100 transition relative group"
                    onClick={() => setPurchaseDialogOpen(true)}
                  >
                    <p className="text-2xl font-bold text-yellow-600">
                      {accompanimentStats?.purchases || 0}
                    </p>
                    <p className="text-xs text-gray-500">Achats</p>
                    <ChevronRight className="h-4 w-4 absolute bottom-1 right-1 text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      Cliquer
                    </div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {accompanimentStats
                        ? `${Math.round(accompanimentStats.budget / 1000)}K`
                        : "0K"}
                    </p>
                    <p className="text-xs text-gray-500">Budget FDJ</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">
                      {accompanimentStats?.visits || 0}
                    </p>
                    <p className="text-xs text-gray-500">Visites</p>
                  </div>
                  <div className="text-center p-3 bg-pink-50 rounded-lg">
                    <p className="text-2xl font-bold text-pink-600">
                      {accompanimentStats?.meetings || 0}
                    </p>
                    <p className="text-xs text-gray-500">Rencontres</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">
                      {accompanimentStats?.conflits || 0}
                    </p>
                    <p className="text-xs text-gray-500">Conflits</p>
                  </div>
                </div>
              )}
            </div>

            {/* Contenu divisé en 2 colonnes : Document | Détails */}
            {selectedAccompaniment ? (
              <div className="flex-1 flex gap-4 p-6 overflow-hidden">
                {/* Colonne gauche - Document */}
                <div className="flex-1 bg-white rounded-lg border overflow-hidden flex flex-col">
                  <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Document du Plan d'Affaires
                    </h3>
                    {selectedAccompaniment.file && (
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">
                          {selectedAccompaniment.file.name}
                        </span>
                        <a
                          href={selectedAccompaniment.file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Ouvrir ↗
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 overflow-hidden">
                    {selectedAccompaniment.file ? (
                      <iframe
                        src={`https://docs.google.com/gview?url=${encodeURIComponent(
                          selectedAccompaniment.file.url
                        )}&embedded=true`}
                        className="w-full h-full border-0"
                        title="Document"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <div className="text-center">
                          <FileText className="h-16 w-16 mx-auto mb-4" />
                          <p>Aucun document disponible</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Colonne droite - Détails */}
                <div className="flex-1 bg-white rounded-lg border overflow-y-auto">
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="font-semibold text-lg mb-2">
                        {selectedAccompaniment.name}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {selectedAccompaniment.adresse}
                      </p>
                    </div>

                    <div className="space-y-6">
                      {selectedAccompaniment.project && (
                        <div>
                          <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Projet
                          </h5>
                          <div className="text-sm space-y-1">
                            <p>
                              <span className="text-gray-500">Nom:</span>{" "}
                              {selectedAccompaniment.project.name}
                            </p>
                            <p>
                              <span className="text-gray-500">Lieu:</span>{" "}
                              {selectedAccompaniment.project.local}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedAccompaniment.members && (
                        <div>
                          <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Membres ({selectedAccompaniment.members.length})
                          </h5>
                          <div className="space-y-2">
                            {selectedAccompaniment.members.map(
                              (member: any) => (
                                <div
                                  key={member.id}
                                  className="flex items-center gap-2 p-2 border rounded text-sm"
                                >
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={member.profile} />
                                    <AvatarFallback>
                                      {member.name.substring(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <p className="font-medium">{member.name}</p>
                                    <p className="text-xs text-gray-500">
                                      {member.phone}
                                    </p>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {selectedAccompaniment.purchases && (
                        <div>
                          <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            Achats ({selectedAccompaniment.purchases.length})
                          </h5>
                          <div className="space-y-2">
                            {selectedAccompaniment.purchases.map(
                              (purchase: any, index: number) => (
                                <div
                                  key={purchase.id}
                                  className="flex justify-between items-center p-3 border rounded-lg text-sm cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-all group"
                                  onClick={() => {
                                    setSelectedPurchase({
                                      ...purchase,
                                      index: index + 1,
                                    });
                                    setSinglePurchaseDialogOpen(true);
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-xs font-semibold">
                                      {index + 1}
                                    </div>
                                    <span className="font-medium">
                                      {new Date(
                                        purchase.createdAt
                                      ).toLocaleDateString("fr-FR")}
                                    </span>
                                    {purchase.purchaseItems && (
                                      <span className="text-xs text-gray-500">
                                        ({purchase.purchaseItems.length}{" "}
                                        articles)
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className="group-hover:border-blue-500"
                                    >
                                      {purchase.total.toLocaleString()} FDJ
                                    </Badge>
                                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {selectedAccompaniment.planning?.visit && (
                        <div>
                          <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Visites (
                            {selectedAccompaniment.planning.visit.length})
                          </h5>
                          <div className="space-y-2">
                            {selectedAccompaniment.planning.visit.map(
                              (visit: any) => {
                                const rencontre = getRencontreForVisit(
                                  visit.id
                                );
                                const hasRencontre = !!rencontre;

                                return (
                                  <div
                                    key={visit.id}
                                    className={`p-3 border rounded-lg text-sm ${
                                      hasRencontre
                                        ? "cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all"
                                        : ""
                                    } relative group`}
                                    onClick={() => {
                                      if (hasRencontre) {
                                        setSelectedRencontre(rencontre);
                                        setRencontreDialogOpen(true);
                                      }
                                    }}
                                  >
                                    <div className="flex justify-between items-start mb-1">
                                      <div className="flex items-center gap-2 flex-1">
                                        <span className="font-medium">
                                          {new Date(
                                            visit.date
                                          ).toLocaleDateString("fr-FR")}
                                        </span>
                                        {hasRencontre && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs bg-green-50 border-green-300 text-green-700"
                                          >
                                            <MessageSquare className="h-3 w-3 mr-1" />
                                            Rencontre
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge
                                          variant={
                                            visit.status
                                              ? "default"
                                              : "secondary"
                                          }
                                        >
                                          {visit.status ? (
                                            <CheckCircle2 className="h-3 w-3" />
                                          ) : (
                                            "En attente"
                                          )}
                                        </Badge>
                                        {hasRencontre && (
                                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                        )}
                                      </div>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                      {visit.location} - {visit.objetif}
                                    </p>
                                    {hasRencontre && (
                                      <p className="text-xs text-blue-600 mt-1">
                                        Cliquez pour voir les détails de la
                                        rencontre
                                      </p>
                                    )}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}

                      {selectedAccompaniment.conflits && (
                        <div>
                          <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Conflits ({selectedAccompaniment.conflits.length})
                          </h5>
                          {selectedAccompaniment.conflits.length > 0 ? (
                            <div className="space-y-2">
                              {selectedAccompaniment.conflits.map(
                                (conflit: any, index: number) => (
                                  <div
                                    key={conflit.id}
                                    className="p-3 border rounded-lg text-sm cursor-pointer hover:bg-red-50 hover:border-red-300 transition-all group"
                                    onClick={() => {
                                      setSelectedConflit(conflit);
                                      setConflitDialogOpen(true);
                                    }}
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="flex items-center gap-2 flex-1">
                                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xs font-semibold">
                                          {index + 1}
                                        </div>
                                        <span className="font-medium text-gray-800 line-clamp-1">
                                          {conflit.nature}
                                        </span>
                                      </div>
                                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors flex-shrink-0" />
                                    </div>
                                    <div className="flex items-center gap-2 ml-8">
                                      <Badge
                                        variant={
                                          conflit.status
                                            ? "default"
                                            : "secondary"
                                        }
                                        className="text-xs"
                                      >
                                        {conflit.status ? "Résolu" : "En cours"}
                                      </Badge>
                                      {conflit.partieImpliques && (
                                        <span className="text-xs text-gray-500">
                                          {conflit.partieImpliques.length}{" "}
                                          partie(s)
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-red-600 mt-1 ml-8">
                                      Cliquez pour voir les détails
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-gray-400 text-xs">
                              Aucun conflit enregistré
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <FileText className="h-16 w-16 mx-auto mb-4" />
                  <p>Sélectionnez un accompagnement pour voir les détails</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Dialog des achats */}
      <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
        <DialogContent className="!max-w-6xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div>Détails des Achats</div>
                <div className="text-sm font-normal text-gray-500">
                  {selectedAccompaniment?.name}
                </div>
              </div>
              <Badge variant="outline" className="text-base px-3 py-1">
                {selectedAccompaniment?.purchases?.length || 0} Achat(s)
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Historique complet des achats avec détails des articles, quantités
              et factures
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 mt-4 pr-2">
            {selectedAccompaniment?.purchases &&
            selectedAccompaniment.purchases.length > 0 ? (
              selectedAccompaniment.purchases.map(
                (purchase: any, index: number) => (
                  <Card key={purchase.id} className="border-2">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-6 pb-4 border-b">
                        <div className="flex items-center gap-3">
                          <div className="bg-yellow-100 text-yellow-700 font-bold w-10 h-10 rounded-full flex items-center justify-center">
                            #{index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              Achat du{" "}
                              {new Date(purchase.createdAt).toLocaleDateString(
                                "fr-FR",
                                {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </h3>
                            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                              <Calendar className="h-3 w-3" />
                              Créé le{" "}
                              {new Date(purchase.createdAt).toLocaleString(
                                "fr-FR",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500">
                          💰 {purchase.total.toLocaleString()} FDJ
                        </Badge>
                      </div>

                      {purchase.purchaseItems &&
                        purchase.purchaseItems.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-4">
                              <div className="h-1 w-1 bg-yellow-500 rounded-full"></div>
                              <h4 className="font-semibold text-base text-gray-700">
                                Articles achetés (
                                {purchase.purchaseItems.length})
                              </h4>
                            </div>
                            <div className="grid gap-4">
                              {purchase.purchaseItems.map(
                                (item: any, itemIndex: number) => (
                                  <div
                                    key={item.id}
                                    className="flex gap-4 p-4 border-2 rounded-xl bg-gradient-to-br from-gray-50 to-white transition-all"
                                  >
                                    <div className="text-gray-400 font-semibold text-sm w-6 flex-shrink-0">
                                      {itemIndex + 1}.
                                    </div>
                                    {item.image && (
                                      <div className="relative group flex-shrink-0">
                                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-gray-200 group-hover:border-yellow-400 transition-colors overflow-hidden flex items-center justify-center p-1">
                                          <img
                                            src={item.image}
                                            alt={item.name || "Article"}
                                            className="max-w-full max-h-full object-contain"
                                            style={{
                                              backgroundColor: "transparent",
                                            }}
                                            onError={(e) => {
                                              const target =
                                                e.target as HTMLImageElement;
                                              target.style.display = "none";
                                              const parent =
                                                target.parentElement;
                                              if (parent) {
                                                parent.innerHTML =
                                                  '<div class="text-gray-400 text-xs text-center">Image<br/>non dispo</div>';
                                              }
                                            }}
                                          />
                                        </div>
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all"></div>
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-semibold text-base mb-2 text-gray-800">
                                        {item.name}
                                      </h5>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 text-sm">
                                          <span className="text-gray-500">
                                            Prix unitaire:
                                          </span>
                                          <span className="font-semibold text-blue-600">
                                            {parseInt(
                                              item.price
                                            ).toLocaleString()}{" "}
                                            FDJ
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                          <span className="text-gray-500">
                                            Quantité:
                                          </span>
                                          <Badge variant="secondary">
                                            {item.quantity}x
                                          </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                          <span className="text-gray-500">
                                            Total article:
                                          </span>
                                          <span className="font-bold text-green-600">
                                            {(
                                              parseInt(item.price) *
                                              item.quantity
                                            ).toLocaleString()}{" "}
                                            FDJ
                                          </span>
                                        </div>
                                        {item.date && (
                                          <div className="flex items-center gap-2 text-sm">
                                            <span className="text-gray-500">
                                              Date achat:
                                            </span>
                                            <span className="text-gray-700">
                                              {new Date(
                                                item.date
                                              ).toLocaleDateString("fr-FR")}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    {item.facture && item.facture !== "d" && (
                                      <a
                                        href={item.facture}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors self-start border border-blue-200"
                                      >
                                        <FileText className="h-4 w-4" />
                                        Facture
                                      </a>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </CardContent>
                  </Card>
                )
              )
            ) : (
              <div className="text-center py-16 text-gray-500">
                <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-12 w-12 text-gray-300" />
                </div>
                <p className="text-lg font-medium">Aucun achat enregistré</p>
                <p className="text-sm text-gray-400 mt-1">
                  Les achats apparaîtront ici une fois effectués
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour un achat individuel */}
      <Dialog
        open={singlePurchaseDialogOpen}
        onOpenChange={setSinglePurchaseDialogOpen}
      >
        <DialogContent className="!max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div>Détails de l'Achat #{selectedPurchase?.index}</div>
                <div className="text-sm font-normal text-gray-500">
                  {selectedPurchase &&
                    new Date(selectedPurchase.createdAt).toLocaleDateString(
                      "fr-FR",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                </div>
              </div>
              <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500">
                💰 {selectedPurchase?.total.toLocaleString()} FDJ
              </Badge>
            </DialogTitle>
            <DialogDescription>
              {selectedPurchase?.purchaseItems?.length || 0} article(s)
              acheté(s) lors de cette transaction
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto mt-4 pr-2">
            {selectedPurchase?.purchaseItems &&
            selectedPurchase.purchaseItems.length > 0 ? (
              <div className="space-y-4">
                {selectedPurchase.purchaseItems.map(
                  (item: any, itemIndex: number) => (
                    <Card key={item.id} className="border-2">
                      <CardContent className="p-5">
                        <div className="flex gap-4">
                          <div className="text-gray-400 font-bold text-lg w-8 flex-shrink-0 flex items-start justify-center pt-1">
                            {itemIndex + 1}.
                          </div>
                          {item.image && (
                            <div
                              className="relative group flex-shrink-0 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(item.image);
                                setImageDialogOpen(true);
                              }}
                            >
                              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-2 border-gray-200 group-hover:border-yellow-400 transition-colors overflow-hidden flex items-center justify-center p-2">
                                <img
                                  src={item.image}
                                  alt={item.name || "Article"}
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-xl mb-3 text-gray-800">
                              {item.name}
                            </h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">
                                    Prix unitaire:
                                  </span>
                                  <span className="font-bold text-lg text-blue-600">
                                    {parseInt(item.price).toLocaleString()} FDJ
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">
                                    Quantité:
                                  </span>
                                  <Badge
                                    variant="secondary"
                                    className="text-base px-3 py-1"
                                  >
                                    {item.quantity}x
                                  </Badge>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">
                                    Total article:
                                  </span>
                                  <span className="font-bold text-xl text-green-600">
                                    {(
                                      parseInt(item.price) * item.quantity
                                    ).toLocaleString()}{" "}
                                    FDJ
                                  </span>
                                </div>
                                {item.date && (
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                      {new Date(item.date).toLocaleDateString(
                                        "fr-FR",
                                        {
                                          day: "2-digit",
                                          month: "long",
                                          year: "numeric",
                                        }
                                      )}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            {item.facture && item.facture !== "d" && (
                              <a
                                href={item.facture}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors border border-blue-200"
                              >
                                <FileText className="h-4 w-4" />
                                Télécharger la facture
                              </a>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Aucun article dans cet achat</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour afficher une image agrandie */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="!max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image de l'article</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 min-h-[500px]">
            {selectedImage && (
              <div className="bg-white p-6 rounded-lg relative">
                <img
                  src={selectedImage}
                  alt="Image agrandie"
                  className="max-w-[800px] max-h-[70vh] object-contain rounded-lg"
                  style={{ backgroundColor: "transparent" }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.alt = "Image non disponible";
                    target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour afficher les détails d'une rencontre */}
      <Dialog open={rencontreDialogOpen} onOpenChange={setRencontreDialogOpen}>
        <DialogContent className="!max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div>Détails de la Rencontre</div>
                {selectedRencontre?.visit && (
                  <div className="text-sm font-normal text-gray-500">
                    {new Date(selectedRencontre.visit.date).toLocaleDateString(
                      "fr-FR",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}{" "}
                    - {selectedRencontre.visit.location}
                  </div>
                )}
              </div>
            </DialogTitle>
            <DialogDescription>
              Compte rendu de la rencontre avec les bénéficiaires
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 mt-4 pr-2">
            {selectedRencontre && (
              <>
                {/* Ordre du jour */}
                {selectedRencontre.order &&
                  selectedRencontre.order.length > 0 && (
                    <Card className="border-2">
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-blue-700">
                          <ClipboardList className="h-5 w-5" />
                          Ordre du jour
                        </h3>
                        <ul className="space-y-2">
                          {selectedRencontre.order.map(
                            (item: string, index: number) => (
                              <li key={index} className="flex gap-3">
                                <span className="font-semibold text-blue-600">
                                  {index + 1}.
                                </span>
                                <span className="text-gray-700">{item}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                {/* Décisions */}
                {selectedRencontre.decisions &&
                  selectedRencontre.decisions.length > 0 && (
                    <Card className="border-2">
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-green-700">
                          <FileCheck className="h-5 w-5" />
                          Décisions prises
                        </h3>
                        <ul className="space-y-2">
                          {selectedRencontre.decisions.map(
                            (item: string, index: number) => (
                              <li key={index} className="flex gap-3">
                                <span className="font-semibold text-green-600">
                                  ✓
                                </span>
                                <span className="text-gray-700">{item}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                {/* Actions */}
                {selectedRencontre.actions &&
                  selectedRencontre.actions.length > 0 && (
                    <Card className="border-2">
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-orange-700">
                          <CheckCircle2 className="h-5 w-5" />
                          Actions à mener
                        </h3>
                        <ul className="space-y-2">
                          {selectedRencontre.actions.map(
                            (item: string, index: number) => (
                              <li key={index} className="flex gap-3">
                                <span className="font-semibold text-orange-600">
                                  →
                                </span>
                                <span className="text-gray-700">{item}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                {/* Signatures / Présences */}
                {selectedRencontre.signatures &&
                  selectedRencontre.signatures.length > 0 && (
                    <Card className="border-2">
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-purple-700">
                          <UserCircle className="h-5 w-5" />
                          Participants ({selectedRencontre.signatures.length})
                        </h3>
                        <div className="grid gap-3">
                          {selectedRencontre.signatures.map(
                            (signature: any) => (
                              <div
                                key={signature.id}
                                className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50"
                              >
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={signature.member?.profile}
                                  />
                                  <AvatarFallback>
                                    {signature.member?.name?.substring(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="font-medium">
                                    {signature.member?.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {signature.member?.phone}
                                  </p>
                                </div>
                                <Badge
                                  variant={
                                    signature.present ? "default" : "secondary"
                                  }
                                >
                                  {signature.present ? "Présent" : "Absent"}
                                </Badge>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                {/* Documents / Photos */}
                {selectedRencontre.files &&
                  selectedRencontre.files.length > 0 && (
                    <Card className="border-2">
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-indigo-700">
                          <FileText className="h-5 w-5" />
                          Documents ({selectedRencontre.files.length})
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {selectedRencontre.files.map((file: any) => (
                            <div key={file.id} className="relative group">
                              {file.type === "image" ? (
                                <div
                                  className="cursor-pointer"
                                  onClick={() => {
                                    setSelectedImage(file.url);
                                    setImageDialogOpen(true);
                                  }}
                                >
                                  <img
                                    src={file.url}
                                    alt={file.name}
                                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 group-hover:border-indigo-400 transition-colors"
                                  />

                                  <p className="text-sm text-gray-600 mt-2 text-center">
                                    {file.name}
                                  </p>
                                </div>
                              ) : (
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-4 border-2 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <FileText className="h-8 w-8 text-gray-400" />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">
                                      {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {(file.size / 1024).toFixed(1)} KB
                                    </p>
                                  </div>
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                {/* Informations sur la visite */}
                {selectedRencontre.visit && (
                  <Card className="border-2 bg-gray-50">
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-700">
                        <Calendar className="h-5 w-5" />
                        Informations de la visite
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Date:</span>
                          <p className="font-medium">
                            {new Date(
                              selectedRencontre.visit.date
                            ).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Horaire:</span>
                          <p className="font-medium">
                            {selectedRencontre.visit.startTime} -{" "}
                            {selectedRencontre.visit.endTime}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Lieu:</span>
                          <p className="font-medium">
                            {selectedRencontre.visit.location}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Objectif:</span>
                          <p className="font-medium">
                            {selectedRencontre.visit.objetif}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour afficher les détails d'un conflit */}
      <Dialog open={conflitDialogOpen} onOpenChange={setConflitDialogOpen}>
        <DialogContent className="!max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <div>Détails du Conflit</div>
                {selectedConflit && (
                  <div className="text-sm font-normal text-gray-500">
                    {new Date(selectedConflit.createdAt).toLocaleDateString(
                      "fr-FR",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </div>
                )}
              </div>
              <Badge
                variant={selectedConflit?.status ? "default" : "secondary"}
                className="text-base px-3 py-1"
              >
                {selectedConflit?.status ? "✓ Résolu" : "⏳ En cours"}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur le conflit et les parties impliquées
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 mt-4 pr-2">
            {selectedConflit && (
              <>
                {/* Nature du conflit */}
                <Card className="border-2 border-red-200">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-red-700">
                      <AlertTriangle className="h-5 w-5" />
                      Nature du conflit
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedConflit.nature}
                    </p>
                  </CardContent>
                </Card>

                {/* Résolution */}
                {selectedConflit.resolution && (
                  <Card className="border-2">
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-green-700">
                        <Scale className="h-5 w-5" />
                        Résolution proposée
                      </h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {selectedConflit.resolution}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Parties impliquées */}
                {selectedConflit.partieImpliques &&
                  selectedConflit.partieImpliques.length > 0 && (
                    <Card className="border-2">
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-purple-700">
                          <UserCircle className="h-5 w-5" />
                          Parties impliquées (
                          {selectedConflit.partieImpliques.length})
                        </h3>
                        <div className="grid gap-3">
                          {selectedConflit.partieImpliques.map(
                            (partie: any, index: number) => (
                              <div
                                key={partie.id}
                                className="flex items-center gap-3 p-4 border-2 rounded-lg bg-gradient-to-r from-gray-50 to-white"
                              >
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800">
                                    {partie.name}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {partie.role}
                                  </p>
                                </div>
                                <Badge
                                  variant={
                                    partie.signature ? "default" : "secondary"
                                  }
                                >
                                  {partie.signature ? "✓ Signé" : "En attente"}
                                </Badge>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                {/* Documents / Preuves */}
                {selectedConflit.files && selectedConflit.files.length > 0 && (
                  <Card className="border-2">
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-indigo-700">
                        <FileText className="h-5 w-5" />
                        Documents attachés ({selectedConflit.files.length})
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedConflit.files.map((file: any) => (
                          <div key={file.id} className="relative group">
                            {file.type === "image" ? (
                              <div
                                className="cursor-pointer"
                                onClick={() => {
                                  setSelectedImage(file.url);
                                  setImageDialogOpen(true);
                                }}
                              >
                                <img
                                  src={file.url}
                                  alt={file.name}
                                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 group-hover:border-indigo-400 transition-colors"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all flex items-center justify-center">
                                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                                    🔍 Agrandir
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-2 text-center">
                                  {file.name}
                                </p>
                              </div>
                            ) : (
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-4 border-2 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <FileText className="h-8 w-8 text-gray-400" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {(file.size / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Informations complémentaires */}
                <Card className="border-2 bg-gray-50">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-700">
                      <Calendar className="h-5 w-5" />
                      Informations
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Date de création:</span>
                        <p className="font-medium">
                          {new Date(
                            selectedConflit.createdAt
                          ).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">
                          Dernière mise à jour:
                        </span>
                        <p className="font-medium">
                          {new Date(
                            selectedConflit.updatedAt
                          ).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Statut:</span>
                        <p className="font-medium">
                          {selectedConflit.status
                            ? "✓ Résolu"
                            : "⏳ En cours de résolution"}
                        </p>
                      </div>
                      {selectedConflit.users && (
                        <div>
                          <span className="text-gray-500">Accompagnateur:</span>
                          <p className="font-medium">
                            {selectedConflit.users.name}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
