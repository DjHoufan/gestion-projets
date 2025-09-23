"use client";

import { useEffect, useMemo } from "react";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
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
import { Progress } from "@/core/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";

import {
  Clock,
  Users,
  Plus,
  ShoppingCart,
  Calendar,
  Package,
  MoreVertical,
  TrendingUp,
  Activity,
  Download,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Filter,
  Languages,
  UserX,
  UserCheck,
} from "lucide-react";
import { IdType, PermissionProps } from "@/core/lib/types";
import { useGetOneAccompaniment } from "@/core/hooks/use-accompaniment";
import { Skeleton } from "@/core/components/ui/skeleton";
import { useModal } from "@/core/providers/modal-provider";
import CustomModal from "@/core/components/wrappeds/custom-modal";
import { PurchaseForm } from "@/core/view/purchase/purchase-form";
import { Status, StatusIndicator } from "@/core/components/ui/status";
import {
  calculateProgress,
  definePermissions,
  formatCurrency,
  formatDate,
} from "@/core/lib/utils";

import { PurchaseView } from "@/core/view/purchase/purchase-view";
import {
  useMaps,
  useMedia,
  usePlanningStore,
  usePurchases,
  useTabs,
} from "@/core/hooks/store";
import PlanningCalendar from "@/core/view/planning/planning-view";

import MapsForm from "@/core/view/maps/map-form";
import LeafletMap from "@/core/view/maps/leaflet-map";
import { FaRegFileWord } from "react-icons/fa";
import MediaForm from "@/core/view/accompaniment/Media-form";
import { MediaGallery } from "@/core/view/accompaniment/media-card";

export const AccompanimentDetails = ({
  Id,
  permission,
}: IdType & PermissionProps) => {
  const { canAdd, canModify, canDelete } = useMemo(() => {
    return definePermissions(permission, "accompagnements");
  }, [permission]);

  const { open } = useModal();
  const purchases = usePurchases();
  const plannings = usePlanningStore();
  const maps = useMaps();
  const media = useMedia();
  const tabs = useTabs();

  const { data, isPending } = useGetOneAccompaniment(Id);

  useEffect(() => {
    if (!data) return;

    if (data.purchases) purchases.setData(data.purchases);
    if (data.media) media.setData(data.media);
    if (data.planning) plannings.setPlanning(data.planning);
    if (data.map) maps.setData(data.map);
  }, [data]);

  const totalSum = useMemo(() => {
    return (
      purchases.data.reduce((sum, purchase) => sum + purchase.total, 0) ?? 0
    );
  }, [purchases.data]);

  const handleMapClick = (lat: number, lng: number) => {
    const updatedMap = {
      ...maps.data!,

      latitude: lat.toString(),
      longitude: lng.toString(),
    };

    open(
      <CustomModal z="!z-[999]" size="md:max-w-[600px]">
        <MapsForm
          id={Id}
          edited={maps.data ? true : false}
          details={updatedMap!}
        />
      </CustomModal>
    );
  };
  if (isPending || !data) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen">
      {/* Quick Stats avec couleurs - Responsive Grid */}
      <div className="mx-auto px-4 sm:px-6  ">
        <div className="p-5 flex justify-between items-center">
          <h2 className="text-xl font-bold first-letter:text-primary">
            {data.name}
          </h2>
          <Button
            onClick={() =>
              open(
                <CustomModal>
                  {data.file.type === "application/pdf" ? (
                    <iframe
                      src={data.file.url ?? ""}
                      width="100%"
                      height="550px"
                      style={{ border: "none" }}
                    >
                      <a
                        href={data.file.url ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ouvrir le PDF
                      </a>
                    </iframe>
                  ) : (
                    <iframe
                      src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                        data.file.url ?? ""
                      )}`}
                      width="100%"
                      height="550px"
                    >
                      This is an embedded
                      <a
                        target="_blank"
                        href={data.file.url ?? "#"}
                        rel="noreferrer"
                      >
                        Microsoft Office
                      </a>{" "}
                      document, powered by
                      <a
                        target="_blank"
                        href="https://office.com/webapps"
                        rel="noreferrer"
                      >
                        Office
                      </a>
                      .
                    </iframe>
                  )}
                </CustomModal>
              )
            }
          >
            <FaRegFileWord />
            Consulter le plan d'affaires
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Budget - Vert */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-emerald-100 text-xs sm:text-sm font-medium mb-1">
                    Budget Alloué
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-white truncate">
                    {formatCurrency(data?.budget!)}
                  </p>
                  <p className="text-xs text-emerald-200 mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">Budget disponible</span>
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm ml-2 flex-shrink-0">
                  <h2 className="text-xs sm:text-sm font-bold">Fdj</h2>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bénéficiaires - Bleu */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-blue-100 text-xs sm:text-sm font-medium mb-1">
                    Bénéficiaires
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {data.members.length}
                  </p>
                  <p className="text-xs text-blue-200 mt-1 flex items-center">
                    <Activity className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">Participants actifs</span>
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm ml-2 flex-shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visites - Violet */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-purple-100 text-xs sm:text-sm font-medium mb-1">
                    Visites Planifiées
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {data.planning?.visit.length || 0}
                  </p>
                  <p className="text-xs text-purple-200 mt-1 flex items-center">
                    <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">Sessions programmées</span>
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm ml-2 flex-shrink-0">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dépenses - Orange */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-orange-100 text-xs sm:text-sm font-medium mb-1">
                    Dépenses
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-white truncate">
                    {formatCurrency(totalSum || 0)}
                  </p>
                  <p className="text-xs text-orange-200 mt-1 flex items-center">
                    <Package className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">Total des achats</span>
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm ml-2 flex-shrink-0">
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation - Responsive */}
        <Tabs
          value={tabs.value}
          onValueChange={tabs.set}
          className="space-y-4 sm:space-y-6"
        >
          {/* Navigation responsive avec scroll horizontal sur mobile */}
          <div className="w-full overflow-x-auto">
            <TabsList className="inline-flex min-w-full sm:min-w-0 w-max sm:w-full grid-cols-5 bg-white border border-gray-200 p-1 rounded-md shadow-sm h-12 sm:h-14">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded font-medium py-2 sm:py-4 px-2 sm:px-3 text-xs sm:text-sm whitespace-nowrap"
              >
                <span className="hidden sm:inline">Vue d'ensemble</span>
                <span className="sm:hidden">Vue</span>
              </TabsTrigger>
              <TabsTrigger
                value="beneficiaires"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded font-medium py-2 sm:py-4 px-2 sm:px-3 text-xs sm:text-sm whitespace-nowrap"
              >
                Bénéficiaires
              </TabsTrigger>
              <TabsTrigger
                value="planning"
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded font-medium py-2 sm:py-4 px-2 sm:px-3 text-xs sm:text-sm whitespace-nowrap"
              >
                Planning
              </TabsTrigger>
              <TabsTrigger
                value="achats"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded font-medium py-2 sm:py-4 px-2 sm:px-3 text-xs sm:text-sm whitespace-nowrap"
              >
                Achats
              </TabsTrigger>
              <TabsTrigger
                value="cartes"
                className="data-[state=active]:bg-fuchsia-600 data-[state=active]:text-white rounded font-medium py-2 sm:py-4 px-2 sm:px-3 text-xs sm:text-sm whitespace-nowrap"
              >
                <span className="hidden sm:inline">Localisations</span>
                <span className="sm:hidden">Cartes</span>
              </TabsTrigger>
              <TabsTrigger
                value="media"
                className="data-[state=active]:bg-lime-600 data-[state=active]:text-white rounded font-medium py-2 sm:py-4 px-2 sm:px-3 text-xs sm:text-sm whitespace-nowrap"
              >
                <span className="hidden sm:inline">Média</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab - Layout responsive */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
              {/* Accompagnateur - Responsive Card */}
              <Card className="border-0 shadow-sm xl:col-span-1">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
                    <span>Accompagnateur</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Avatar className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-emerald-100 flex-shrink-0">
                      <AvatarImage
                        src={data.users?.profile! || "/placeholder.svg"}
                        alt={data.users?.name!}
                      />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold text-sm sm:text-lg">
                        {data.users
                          ?.name!.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">
                        {data.users?.name}
                      </h3>
                      <Status
                        status={data.users?.status ? "online" : "offline"}
                        className="bg-emerald-100 text-emerald-800 text-xs sm:text-sm"
                      >
                        <StatusIndicator />
                        {data.users?.status ? "Actif" : "Désactivé"}
                      </Status>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-700 truncate">
                        {data.users?.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-700">
                        {data.users?.phone}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-gray-700 break-words">
                        {data.users?.address}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Projet - Responsive Card */}
              <Card className="border-0 shadow-sm xl:col-span-2">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                    <Building className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0" />
                    <span>Groupe</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg sm:text-xl text-gray-900 mb-2 break-words">
                      {data.name}
                    </h3>
                    <Badge
                      className={
                        data.status
                          ? "bg-amber-100 text-blue-800"
                          : "bg-emerald-100 text-emerald-800"
                      }
                    >
                      {data.status ? "Terminé" : "En cours"}
                    </Badge>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                          Projet {data.project.name}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-gray-900 ml-2">
                          {Math.round(
                            calculateProgress(
                              data.project.startDate,
                              data.project.endDate
                            )
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={calculateProgress(
                          data.project.startDate,
                          data.project.endDate
                        )}
                        className="h-2 sm:h-3"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="p-3 sm:p-4 bg-amber-50 rounded-lg border border-amber-100">
                        <p className="text-amber-700 text-xs sm:text-sm font-medium mb-1">
                          Date de début
                        </p>
                        <p className="text-amber-900 font-semibold text-sm sm:text-base">
                          {formatDate(data.project.startDate.toDateString())}
                        </p>
                      </div>
                      <div className="p-3 sm:p-4 bg-amber-50 rounded-lg border border-amber-100">
                        <p className="text-amber-700 text-xs sm:text-sm font-medium mb-1">
                          Date de fin
                        </p>
                        <p className="text-amber-900 font-semibold text-sm sm:text-base">
                          {formatDate(data.project.endDate.toDateString())}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bénéficiaires Tab - Grid responsive */}
          <TabsContent value="beneficiaires" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Bénéficiaires ({data.members.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {data.members.map((member, index) => (
                <Card
                  key={member.id}
                  className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <Avatar className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-emerald-100 flex-shrink-0">
                        <AvatarImage
                          src={member.profile || "/placeholder.svg"}
                          alt={member.name}
                        />
                        <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold text-sm">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">
                          {member.name}
                        </h3>
                        <Badge className="bg-emerald-100 text-emerald-800 text-xs mt-1">
                          #{index + 1}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Statut
                        </p>
                        <span
                          className={`flex items-center gap-2 px-3 py-1.5 justify-center  rounded-full text-sm font-medium ${
                            member.statut === "oui"
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : "bg-green-100 text-green-700 border border-green-200"
                          }`}
                        >
                          {member.statut === "oui" ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                          {member.statut === "oui"
                            ? `Abandonné${member.gender === "Femme" ? "e" : ""}`
                            : "Actif"}
                        </span>
                      </div>
                      <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Attestation
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 break-words">
                          {member.attestation}
                        </p>
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-600">{member.phone}</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs sm:text-sm">
                          <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 break-words">
                            {member.commune} / {member.residential}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-xs sm:text-sm">
                          <Languages className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 break-words">
                            {member.language
                              .split(", ")
                              .map((lang: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {lang.trim()}
                                </Badge>
                              ))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Planning Tab */}
          <TabsContent value="planning" className="space-y-4 sm:space-y-6">
            <PlanningCalendar
              permission={{ canModify, canAdd, canDelete }}
              members={data.members}
              accompanimentId={data.id}
              userId={data.users?.id!}
            />
          </TabsContent>

          {/* Achats Tab - Responsive Actions */}
          <TabsContent value="achats" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Achats et dépenses
                </h2>
                <p className="text-base sm:text-lg font-semibold text-orange-600 mt-1">
                  Total: {formatCurrency(totalSum || 0)}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="flex gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    className="gap-2 bg-transparent flex-1 sm:flex-none"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Exporter</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 bg-transparent flex-1 sm:flex-none"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Filtrer</span>
                  </Button>
                </div>
                {canAdd && (
                  <Button
                    onClick={() =>
                      open(
                        <CustomModal size="md:max-w-[1000px]">
                          <PurchaseForm Id={data.id} />
                        </CustomModal>
                      )
                    }
                    className="bg-orange-600 hover:bg-orange-700 gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Ajouter un achat</span>
                    <span className="sm:hidden">Ajouter</span>
                  </Button>
                )}
              </div>
            </div>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <PurchaseView permission={{ canModify, canAdd, canDelete }} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cartes Tab - Responsive Header */}
          <TabsContent value="cartes" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Localisations GPS
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Points de géolocalisation avec cartes interactives
                </p>
              </div>
              {canAdd && (
                <Button
                  onClick={() =>
                    open(
                      <CustomModal size="md:max-w-[600px]" z="!z-[999]">
                        <MapsForm id={Id} edited={false} details={maps.data!} />
                      </CustomModal>
                    )
                  }
                  className="bg-fuchsia-600 hover:bg-fuchsia-700 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {maps.data ? "Modifier" : "Ajouter"} une localisation
                  </span>
                  <span className="sm:hidden">
                    {maps.data ? "Modifier" : "Ajouter"}
                  </span>
                </Button>
              )}
            </div>

            <div className="h-64 sm:h-96 lg:h-[500px]">
              <LeafletMap
                coordinates={[maps.data!]}
                onMapClick={canAdd ? handleMapClick : () => {}}
              />
            </div>
          </TabsContent>
          <TabsContent value="media" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Localisations GPS
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Points de géolocalisation avec cartes interactives
                </p>
              </div>
              {canAdd && (
                <Button
                  onClick={() =>
                    open(
                      <CustomModal size="md:max-w-[600px]" z="!z-[999]">
                        <MediaForm id={Id} />
                      </CustomModal>
                    )
                  }
                  className="bg-lime-600 hover:bg-lime-700 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    Ajouter des photos, video ...
                  </span>
                </Button>
              )}
            </div>

            <div className="h-64 sm:h-96 lg:h-[500px]">
              <MediaGallery canDelete={canDelete} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const Loading = () => {
  return (
    <div className="min-h-screen bg-emerald-50 animate-pulse">
      {/* Quick Stats Loading */}
      <div className=" mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards Loading */}
          {[1, 2, 3, 4].map((index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-24 bg-emerald-200" />
                    <Skeleton className="h-8 w-20 bg-emerald-200" />
                    <Skeleton className="h-3 w-28 bg-emerald-200" />
                  </div>
                  <Skeleton className="w-12 h-12 rounded-xl bg-emerald-200" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Navigation Loading */}
        <div className="space-y-6">
          <div className="w-full flex justify-end">
            <div className="flex  gap-2 bg-white border border-gray-200 p-1 rounded-xl shadow-sm w-fit">
              {[1, 2, 3, 4, 5].map((tab) => (
                <Skeleton
                  key={tab}
                  className="h-10 w-28 rounded-lg bg-emerald-200"
                />
              ))}
            </div>
          </div>

          {/* Content Loading */}
          <div className="space-y-6">
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Accompagnateur */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-5 h-5 rounded bg-emerald-200" />
                    <Skeleton className="h-6 w-32 bg-emerald-200" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-16 h-16 rounded-full bg-emerald-200" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40 bg-emerald-200" />
                      <Skeleton className="h-4 w-32 rounded-full bg-emerald-200" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg"
                      >
                        <Skeleton className="w-4 h-4 rounded bg-emerald-200" />
                        <Skeleton className="h-4 w-48 bg-emerald-200" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Right Column - Projet */}
              <Card className="border-0 shadow-sm lg:col-span-2">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-5 h-5 rounded bg-emerald-200" />
                    <Skeleton className="h-6 w-36 bg-emerald-200" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-64 bg-emerald-200" />
                    <Skeleton className="h-5 w-24 rounded-full bg-emerald-200" />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-40 bg-emerald-200" />
                        <Skeleton className="h-4 w-12 bg-emerald-200" />
                      </div>
                      <Skeleton className="h-3 w-full rounded-full bg-emerald-200" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2].map((item) => (
                        <div
                          key={item}
                          className="p-4 bg-emerald-50 rounded-lg space-y-2"
                        >
                          <Skeleton className="h-4 w-24 bg-emerald-200" />
                          <Skeleton className="h-5 w-32 bg-emerald-200" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Content Sections */}
            <div className="space-y-6">
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48 bg-emerald-200" />
                <Skeleton className="h-10 w-40 rounded-md bg-emerald-200" />
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((card) => (
                  <Card key={card} className="border-0 shadow-sm">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="w-14 h-14 rounded-full bg-emerald-200" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-32 bg-emerald-200" />
                          <Skeleton className="h-4 w-16 rounded-full bg-emerald-200" />
                        </div>
                        <Skeleton className="w-6 h-6 rounded bg-emerald-200" />
                      </div>

                      <div className="space-y-3">
                        {[1, 2].map((section) => (
                          <div
                            key={section}
                            className="p-3 bg-emerald-50 rounded-lg space-y-1"
                          >
                            <Skeleton className="h-3 w-16 bg-emerald-200" />
                            <Skeleton className="h-4 w-28 bg-emerald-200" />
                          </div>
                        ))}

                        <div className="space-y-2">
                          {[1, 2, 3].map((item) => (
                            <div key={item} className="flex items-center gap-2">
                              <Skeleton className="w-3 h-3 rounded bg-emerald-200" />
                              <Skeleton className="h-4 w-40 bg-emerald-200" />
                            </div>
                          ))}
                        </div>
                      </div>

                      <Skeleton className="h-10 w-full rounded-md bg-emerald-200" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Calendar/Planning Section Loading */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-emerald-200 to-emerald-300 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32 bg-white/30" />
                  <div className="flex gap-2">
                    <Skeleton className="w-8 h-8 rounded bg-white/30" />
                    <Skeleton className="w-8 h-8 rounded bg-white/30" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <Skeleton
                      key={day}
                      className="h-12 rounded-lg bg-emerald-200"
                    />
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => (
                    <Skeleton
                      key={i}
                      className="h-24 rounded-lg bg-emerald-200"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((stat) => (
                <Card key={stat} className="border-0 shadow-sm">
                  <CardContent className="p-6 text-center space-y-3">
                    <Skeleton className="w-12 h-12 rounded-full mx-auto bg-emerald-200" />
                    <Skeleton className="h-8 w-16 mx-auto bg-emerald-200" />
                    <Skeleton className="h-4 w-24 mx-auto bg-emerald-200" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Loading Indicator */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white rounded-full p-4 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-gray-600">
              Chargement...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
