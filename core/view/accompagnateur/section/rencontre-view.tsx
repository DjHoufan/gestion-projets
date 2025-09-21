"use client";
import { DataTable } from "@/core/components/global/data-table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent } from "@/core/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/core/components/ui/dialog";
import { RencontreForm } from "@/core/view/rapports/form/rencontre-form";
import {
  RencontreDetail,
  signatureDetail,
} from "@/core/lib/types";
import { useModal } from "@/core/providers/modal-provider";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Edit,
  Eye,
  FileIcon,
  FileText,
  MapPin,
  Paperclip,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useMyData } from "@/core/hooks/store";
import { ScrollArea } from "@/core/components/ui/scroll-area";

export const RencontreView = () => {
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

  const [selectedRencontre, setselectedRencontre] = useState<
    RencontreDetail | undefined
  >(undefined);

  const { open, close } = useModal();

  const { data: user } = useMyData();

  if (!user) {
    return <div>Chargement...</div>;
  }

  const totalRencontres = user.rencontres.length;
  const totalSignatures = user.rencontres.reduce(
    (acc, r) => acc + r.signatures.length,
    0
  );
  const totalPresents = user.rencontres.reduce(
    (acc, r) => acc + r.signatures.filter((s) => s.present).length,
    0
  );

  const openDetails = (rencontre: RencontreDetail) => {
    console.log("Opening details for rencontre:", rencontre);

    setselectedRencontre(rencontre);
    setIsDetailsOpen(true);
  };

  const columns = [
    {
      header: "Date",
      cell: ({ row }: any) => {
        const rencontre = row.original;
        return (
          <div className="flex flex-col whitespace-nowrap">
            <span className="font-medium text-slate-900">
              {format(new Date(rencontre.visit.date), "dd/MM/yyyy")}
            </span>
            <span className="text-sm text-slate-500">
              {format(new Date(rencontre.visit.date), "HH:mm")}
            </span>
          </div>
        );
      },
    },
    {
      id: "lieu",
      header: "Lieu",
      cell: ({ row }: any) => (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          {row.original.lieu}
        </Badge>
      ),
    },
    {
      header: "order du jour",
      cell: ({ row }: any) => (
        <TruncatedTextWithDialog
          items={row.original.order}
          type="order"
          maxLength={40}
        />
      ),
    },
    {
      header: "Decisions",
      cell: ({ row }: any) => (
        <TruncatedTextWithDialog
          items={row.original.order}
          type="decisions"
          maxLength={40}
        />
      ),
    },

    {
      id: "participants",
      header: "Participants",
      cell: ({ row }: any) => {
        const signatures = row.original.signatures;
        return signatures && signatures.length > 0 ? (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {signatures.slice(0, 3).map((signature: signatureDetail) => (
                <Avatar
                  key={signature.id}
                  className="h-8 w-8 ring-2 ring-white shadow-sm"
                >
                  <AvatarImage
                    src={
                      signature.member.profile ||
                      "/placeholder.svg?height=32&width=32"
                    }
                    alt={signature.member.name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xs">
                    {signature.member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            {signatures.length > 3 && (
              <span className="text-xs text-slate-500 ml-1">
                +{signatures.length - 3}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Users className="h-4 w-4" />
            <span>Aucun</span>
          </div>
        );
      },
    },
    {
      header: "Détails",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openDetails(row.original)}
            className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300"
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {}}
            className="h-8 w-8 p-0 hover:bg-green-50 hover:border-green-300"
          >
            <Edit className="h-4 w-4 text-green-600" />
          </Button>
        </div>
      ),
      size: 120,
    },
  ];
  return (
    <section className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100backdrop-blur-sm border shadow hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Rencontres
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {totalRencontres}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 backdrop-blur-sm border shadow hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Participants Présents
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {totalPresents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 backdrop-blur-sm border shadow hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Signatures
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {totalSignatures}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <DataTable<Partial<RencontreDetail> & { id: string }>
        data={user.rencontres ? user.rencontres : []}
        columns={columns}
        searchPlaceholder="Rechercher par nom ou date..."
        searchField="name"
        additionalSearchFields={["phone", "email", "status"]}
        title="rencontres"
        description="Assurez la gestion des informations et des rencontres pour vos différents accompagnateurs"
        canAdd={true}
        onAddButtonClick={() =>
          open(
            <RencontreForm
              open={true}
              onOpenChangeAction={close}
              userId={user.id}
            />
          )
        }
        pageSize={10}
        addButtonText="Enregistre une nouvelle rencontre"
        isPending={user.rencontres ? false : true}
      />

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogTitle>Détails</DialogTitle>
        <DialogContent className="!max-w-6xl max-h-[90vh] overflow-hidden p-0 border-none">
          {selectedRencontre && (
            <div className="flex h-[90vh]">
              {/* Left Sidebar - Fixed */}
              <div className="w-80 bg-gradient-to-b from-teal-600 via-green-600 to-emerald-600 text-white p-6 flex flex-col flex-shrink-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Rencontre</h2>
                    <p className="text-indigo-100 text-sm">Détails complets</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4 mb-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex gap-5 justify-between">
                    <div className="flex items-center justify-between gap-5">
                      <Users className="h-4 w-4 text-indigo-200" />
                      <span className="text-indigo-100 text-sm">
                        Participants
                      </span>
                    </div>
                    <div className="text-2xl font-bold">
                      {selectedRencontre.signatures.length}
                    </div>
                    <div className="text-xs text-indigo-200 mt-1">
                      {
                        selectedRencontre.signatures.filter((s) => s.present)
                          .length
                      }{" "}
                      présents
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex justify-between">
                    <div className="flex items-center justify-between gap-5">
                      <FileText className="h-4 w-4 text-indigo-200" />
                      <span className="text-indigo-100 text-sm">
                        Points traités
                      </span>
                    </div>
                    <div className="text-2xl font-bold">
                      {selectedRencontre.order.length}
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex justify-between">
                    <div className="flex items-center justify-between gap-5">
                      <CheckCircle className="h-4 w-4 text-indigo-200" />
                      <span className="text-indigo-100 text-sm">Décisions</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {selectedRencontre.decisions.length}
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex justify-between">
                    <div className="flex items-center justify-between gap-5">
                      <Clock className="h-4 w-4 text-indigo-200" />
                      <span className="text-indigo-100 text-sm">Actions</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {selectedRencontre.actions.length}
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex justify-between">
                    <div className="flex items-center justify-between gap-5">
                      <Paperclip className="h-4 w-4 text-indigo-200" />
                      <span className="text-indigo-100 text-sm">Fichiers</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {selectedRencontre.files.length}
                    </div>
                  </div>
                </div>

                {/* Meeting Info */}
                <div className="space-y-3 mt-auto">
                  <div className="flex items-center gap-3 text-indigo-100">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {format(
                        new Date(selectedRencontre.visit.date),
                        "dd MMMM yyyy",
                        { locale: fr }
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-indigo-100">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      {format(new Date(selectedRencontre.visit.date), "HH:mm")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-indigo-100">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{selectedRencontre.visit.location}</span>
                  </div>
                </div>
              </div>

              {/* Main Content - Scrollable */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Header */}
                  <div className="border-b pb-4">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                      Rencontre du{" "}
                      {format(new Date(selectedRencontre.visit.date), "dd/MM/yyyy")}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {selectedRencontre.visit.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(new Date(selectedRencontre.visit.date), "HH:mm")}
                      </div>
                    </div>
                  </div>

                  {/* Timeline Style Content */}
                  <div className="space-y-8">
                    {/* Order Section */}
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Ordre du jour
                        </h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
                      </div>
                      <div className="ml-11 space-y-3">
                        {selectedRencontre.order.map((item, index) => (
                          <div
                            key={index}
                            className="group hover:bg-blue-50 p-3 rounded-lg transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium group-hover:bg-blue-600 transition-colors">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <p className="text-slate-800 font-medium">
                                  {item}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Decisions Section */}
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Décisions prises
                        </h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-green-200 to-transparent"></div>
                      </div>
                      <div className="ml-11 space-y-3">
                        {selectedRencontre.decisions.map((item, index) => (
                          <div
                            key={index}
                            className="group hover:bg-green-50 p-3 rounded-lg transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 p-1">
                                <CheckCircle className="h-5 w-5 text-green-500 group-hover:text-green-600 transition-colors" />
                              </div>
                              <div className="flex-1">
                                <p className="text-slate-800">{item}</p>
                                <div className="mt-1 text-xs text-green-600 font-medium">
                                  ✓ Validé
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions Section */}
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Clock className="h-5 w-5 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Actions à suivre
                        </h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent"></div>
                      </div>
                      <div className="ml-11 space-y-3">
                        {selectedRencontre.actions.map((item, index) => (
                          <div
                            key={index}
                            className="group hover:bg-orange-50 p-3 rounded-lg transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 p-1">
                                <Clock className="h-5 w-5 text-orange-500 group-hover:text-orange-600 transition-colors" />
                              </div>
                              <div className="flex-1">
                                <p className="text-slate-800">{item}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Files Section */}
                    {selectedRencontre.files.length > 0 && (
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <Paperclip className="h-5 w-5 text-indigo-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            Fichiers joints ({selectedRencontre.files.length})
                          </h3>
                          <div className="flex-1 h-px bg-gradient-to-r from-indigo-200 to-transparent"></div>
                        </div>
                        <div className="ml-11">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedRencontre.files.map((file) => (
                              <div
                                key={file.id}
                                className="group hover:bg-indigo-50 p-4 rounded-xl border border-slate-200 hover:border-indigo-200 transition-all cursor-pointer"
                              >
                                <div className="flex items-start gap-4">
                                  <div className="flex-shrink-0 p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                                    <FileIcon
                                      type={file.type}
                                      className="h-6 w-6 text-indigo-600"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-slate-900 group-hover:text-indigo-900 transition-colors truncate">
                                      {file.name}
                                    </h4>
                                    <p className="text-sm text-slate-600 capitalize mt-1">
                                      Type: {file.type}
                                    </p>
                                    <div className="mt-3 flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 px-3 text-xs bg-transparent"
                                        onClick={() =>
                                          window.open(file.url, "_blank")
                                        }
                                      >
                                        <Download className="h-3 w-3 mr-1" />
                                        Télécharger
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 px-3 text-xs"
                                        onClick={() =>
                                          window.open(file.url, "_blank")
                                        }
                                      >
                                        <Eye className="h-3 w-3 mr-1" />
                                        Voir
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Participants Section */}
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Users className="h-5 w-5 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Participants ({selectedRencontre.signatures.length})
                        </h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent"></div>
                      </div>
                      <div className="ml-11">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {selectedRencontre.signatures.map((signature) => (
                            <div
                              key={signature.id}
                              className="group hover:bg-purple-50 p-4 rounded-xl border border-slate-200 hover:border-purple-200 transition-all"
                            >
                              <div className="flex items-start gap-4">
                                <div className="relative">
                                  <Avatar className="h-14 w-14 ring-2 ring-white shadow-lg">
                                    <AvatarImage
                                      src={
                                        signature.member.profile ||
                                        "/placeholder.svg?height=56&width=56"
                                      }
                                      alt={signature.member.name}
                                    />
                                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white text-lg font-semibold">
                                      {signature.member.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div
                                    className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                                      signature.present
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                    }`}
                                  >
                                    {signature.present ? (
                                      <CheckCircle className="h-3 w-3 text-white m-0.5" />
                                    ) : (
                                      <X className="h-3 w-3 text-white m-0.5" />
                                    )}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-slate-900 group-hover:text-purple-900 transition-colors">
                                    {signature.member.name}
                                  </h4>

                                  <p className="text-sm text-slate-600">
                                    {signature.member.phone}
                                  </p>
                                  <div className="mt-2 flex items-center gap-2">
                                    {signature.present ? (
                                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                        <CheckCircle className="h-3 w-3" />
                                        Présent
                                      </div>
                                    ) : (
                                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                        <X className="h-3 w-3" />
                                        Absent
                                      </div>
                                    )}
                                    <span className="text-xs text-slate-500">
                                      {format(
                                        new Date(signature.date),
                                        "dd/MM HH:mm"
                                      )}
                                    </span>
                                  </div>
                                  <div className="mt-2 text-xs text-slate-500">
                                    <div>📍 {signature.member.commune}</div>
                                    <div>🎓 {signature.member.residential}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="border-t pt-4 flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                      ID: {selectedRencontre.id}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 bg-transparent"
                      >
                        <Edit className="h-4 w-4" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsDetailsOpen(false)}
                      >
                        Fermer
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

function TruncatedTextWithDialog({
  items,
  type,
  maxLength = 50,
}: {
  items: string[];
  type: "decisions" | "actions" | "order";
  maxLength?: number;
}) {
  if (!items || items.length === 0) {
    return (
      <span className="text-slate-400 text-sm italic">
        Aucune{" "}
        {type === "decisions"
          ? "décision"
          : type === "actions"
          ? "action"
          : "point"}
      </span>
    );
  }

  const colorClasses = {
    decisions: "bg-green-50 text-green-700 border-green-200",
    actions: "bg-orange-50 text-orange-700 border-orange-200",
    order: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const titles = {
    decisions: "Décisions",
    actions: "Actions",
    order: "Ordre du Jour",
  };

  // Show first item truncated
  const firstItem = items[0];
  const truncatedText =
    firstItem.length > maxLength
      ? `${firstItem.substring(0, maxLength)}...`
      : firstItem;
  const hasMore = items.length > 1 || firstItem.length > maxLength;

  return (
    <div className="space-y-1">
      <div className={`p-2 rounded-md border text-sm ${colorClasses[type]}`}>
        <p>{truncatedText}</p>
        {hasMore && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 mt-1 text-xs p-1"
              >
                Voir détails {items.length > 1 && `(${items.length} éléments)`}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>{titles[type]}</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <span className="text-slate-400 text-sm mt-0.5 flex-shrink-0">
                          {idx + 1}.
                        </span>
                        <p className="text-slate-700">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
