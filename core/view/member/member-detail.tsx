"use client";

import { useGetOnEmember } from "@/core/hooks/use-member";
import { IdType } from "@/core/lib/types";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Progress } from "@/core/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import {
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  User,
  Building2,
  Clock,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Edit,
  MoreVertical,
  TrendingUp,
  Calendar,
  Package,
  Wallet,
  Target,
  Users,
  Activity,
  AlertCircle,
  MoveLeft,
} from "lucide-react";

import { Skeleton } from "@/core/components/ui/skeleton";

import { useMemo } from "react";
import { formatDate } from "@/core/lib/utils";
import { useRouter } from "next/navigation";

export const MemberDetail = ({ Id }: IdType) => {
  const router = useRouter();
  const { data: member, isPending } = useGetOnEmember(Id);

  const formatTime = (time: string) => {
    return time;
  };

  // Memoized calculations avec gestion des valeurs nulles
  const calculations = useMemo(() => {
    if (!member?.accompaniment) {
      return {
        totalPurchases: 0,
        completedVisits: 0,
        totalVisits: 0,
        progressPercentage: 0,
        hasAccompaniment: false,
        purchases: [],
        visits: [],
      };
    }

    const purchases = member.accompaniment.purchases ?? [];
    const visits = member.accompaniment.planning?.visit ?? [];

    const totalPurchases = purchases.reduce(
      (sum, purchase) => sum + (purchase.total ?? 0),
      0
    );

    const completedVisits = visits.filter((v) => v?.status).length;
    const totalVisits = visits.length;
    const progressPercentage =
      totalVisits > 0 ? (completedVisits / totalVisits) * 100 : 0;

    return {
      totalPurchases,
      completedVisits,
      totalVisits,
      progressPercentage,
      hasAccompaniment: true,
      purchases,
      visits,
    };
  }, [member]);

  // Memoized user info
  const userInfo = useMemo(() => {
    if (!member) return null;

    return {
      initials: member.name
        .split(" ")
        .map((n) => n[0])
        .join(""),
      accompanimentStatus: member.accompaniment?.status ? "Actif" : "Inactif",
      remainingBudget:
        (member.accompaniment?.budget ?? 0) - calculations.totalPurchases,
    };
  }, [member, calculations.totalPurchases]);

  if (isPending || !member) {
    return <MLoading />;
  }

  const { accompaniment } = member;
  const { hasAccompaniment, visits = [], purchases = [] } = calculations;

  return (
    <div className="min-h-screen">
      {/* Header avec gradient vert */}
      <div className="h-52 bg-gradient-to-r from-emerald-600 to-emerald-600 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Avatar className="h-20 w-20 border-4 border-white/20">
                <AvatarImage
                  src={member.profile || "/placeholder.svg"}
                  alt={member.name}
                />
                <AvatarFallback className="text-2xl bg-emerald-700 text-white">
                  {userInfo?.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">{member.name}</h1>

                <div className="flex items-center gap-3 mt-2">
                  <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    {member.gender}
                  </Badge>
                  <Badge
                    className={`${
                      accompaniment?.status ? "bg-emerald-400" : "bg-yellow-400"
                    } text-emerald-900 border-0`}
                  >
                    {userInfo?.accompanimentStatus}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.back()}
                className="bg-white text-emerald-600 hover:bg-emerald-50 !rounded"
              >
                <MoveLeft />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-6 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-600">
                {calculations.totalVisits}
              </div>
              <div className="text-sm text-gray-600">Total Visites</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-600">
                {calculations.completedVisits}
              </div>
              <div className="text-sm text-gray-600">Terminées</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Wallet className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-600">
                {calculations.totalPurchases.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">DJF Dépensés</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-lime-600" />
              </div>
              <div className="text-3xl font-bold text-lime-600">
                {Math.round(calculations.progressPercentage)}%
              </div>
              <div className="text-sm text-gray-600">Progression</div>
            </CardContent>
          </Card>
        </div>

        {/* Affichage conditionnel si pas d'accompagnement */}
        {!hasAccompaniment ? (
          <Card className="shadow-lg border-0 mb-8">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Aucun accompagnement
              </h3>
              <p className="text-gray-600">
                Ce membre n'a pas encore d'accompagnement assigné.
              </p>
            </CardContent>
          </Card>
        ) : (
          /* Tabs Navigation */
          <Tabs defaultValue="overview" className="space-y-6 mb-5">
            <TabsList className="h-14 grid w-full grid-cols-4 bg-white shadow-sm border-0 ">
              <TabsTrigger
                value="overview"
                className=" data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <User className="h-4 w-4 mr-2" />
                Profil
              </TabsTrigger>
              <TabsTrigger
                value="planning"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Planning
              </TabsTrigger>
              <TabsTrigger
                value="purchases"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <Package className="h-4 w-4 mr-2" />
                Achats
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Accompagnement Card */}
                <Card className="lg:col-span-2 shadow-lg border-0 p-0">
                  <CardHeader className="p-5  bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Accompagnement Actuel
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h4 className="font-semibold text-xl text-gray-800 mb-2">
                          {accompaniment?.name}
                        </h4>
                        <p className="text-gray-600 mb-4">
                          {accompaniment?.adresse}
                        </p>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                            <span className="text-gray-700 font-medium">
                              Budget alloué
                            </span>
                            <span className="font-bold text-emerald-600">
                              {accompaniment?.budget?.toLocaleString() ?? 0} DJF
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700 font-medium">
                              Dépensé
                            </span>
                            <span className="font-bold text-gray-800">
                              {calculations.totalPurchases.toLocaleString()} DJF
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                            <span className="text-gray-700 font-medium">
                              Restant
                            </span>
                            <span className="font-bold text-emerald-600">
                              {userInfo?.remainingBudget?.toLocaleString() ?? 0}{" "}
                              DJF
                            </span>
                          </div>
                        </div>
                      </div>
                      {accompaniment?.project && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-lg mb-3 text-gray-800">
                            Projet: {accompaniment.project.name}
                          </h5>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Début</span>
                              <span className="font-medium">
                                {formatDate(accompaniment.project.startDate)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Fin</span>
                              <span className="font-medium">
                                {formatDate(accompaniment.project.endDate)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Statut</span>
                              <Badge
                                className={
                                  accompaniment.project.status
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-gray-100 text-gray-800"
                                }
                              >
                                {accompaniment.project.status
                                  ? "En cours"
                                  : "Terminé"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Accompagnateur Card */}
                {accompaniment?.users && (
                  <Card className="shadow-lg border-0 p-0">
                    <CardHeader className="p-5 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white rounded-t-lg">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Accompagnateur
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-6">
                        <Avatar className="h-16 w-16 border-2 border-emerald-200">
                          <AvatarImage
                            src={
                              accompaniment.users.profile || "/placeholder.svg"
                            }
                            alt={accompaniment.users.name}
                          />
                          <AvatarFallback className="bg-emerald-100 text-emerald-700">
                            {accompaniment.users.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-lg text-gray-800">
                            {accompaniment.users.name}
                          </p>
                          <p className="text-emerald-600 font-medium">
                            {accompaniment.users.type}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2 hover:bg-emerald-50 rounded-lg transition-colors">
                          <Mail className="h-4 w-4 text-emerald-600" />
                          <span className="text-gray-700">
                            {accompaniment.users.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-2 hover:bg-emerald-50 rounded-lg transition-colors">
                          <Phone className="h-4 w-4 text-emerald-600" />
                          <span className="text-gray-700">
                            {accompaniment.users.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-2 hover:bg-emerald-50 rounded-lg transition-colors">
                          <MapPin className="h-4 w-4 text-emerald-600" />
                          <span className="text-gray-700">
                            {accompaniment.users.address}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Progress Card */}
                {visits.length > 0 && (
                  <Card className="lg:col-span-3 shadow-lg border-0 p-0">
                    <CardHeader className="p-5  bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white rounded-t-lg">
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Progression des Visites
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 font-medium">
                            Progression globale
                          </span>
                          <span className="font-bold text-emerald-600">
                            {calculations.completedVisits}/
                            {calculations.totalVisits} (
                            {Math.round(calculations.progressPercentage)}%)
                          </span>
                        </div>
                        <Progress
                          value={calculations.progressPercentage}
                          className="h-3 bg-emerald-100"
                        />
                      </div>
                      <div className="space-y-4">
                        {visits.slice(0, 3).map((visit) => (
                          <div
                            key={visit?.id}
                            className="flex items-center space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg border border-emerald-100"
                          >
                            <div
                              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                visit?.status
                                  ? "bg-emerald-500"
                                  : "bg-orange-400"
                              }`}
                            >
                              {visit?.status ? (
                                <CheckCircle className="h-5 w-5 text-white" />
                              ) : (
                                <Clock className="h-5 w-5 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">
                                {visit?.objetif}
                              </p>
                              <p className="text-sm text-gray-600">
                                {formatDate(visit?.date)} • {visit?.startTime} -{" "}
                                {visit?.endTime} • {visit?.location}
                              </p>
                            </div>
                            <Badge
                              className={
                                visit?.status
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-orange-100 text-orange-800"
                              }
                            >
                              {visit?.status ? "Terminé" : "Programmé"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="shadow-lg border-0 p-0">
                  <CardHeader className="p-5  bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900  text-white rounded-t-lg">
                    <CardTitle>Informations Personnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-3 bg-emerald-50 rounded-lg">
                        <label className="text-sm font-medium text-emerald-700">
                          Nom complet
                        </label>
                        <p className="mt-1 font-semibold text-gray-800">
                          {member.name}
                        </p>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-lg">
                        <label className="text-sm font-medium text-emerald-700">
                          Genre
                        </label>
                        <p className="mt-1 font-semibold text-gray-800">
                          {member.gender}
                        </p>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-lg">
                        <label className="text-sm font-medium text-emerald-700">
                          Date de naissance
                        </label>
                        <p className="mt-1 font-semibold text-gray-800">
                          {formatDate(member.dob)}
                        </p>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-lg">
                        <label className="text-sm font-medium text-emerald-700">
                          Téléphone
                        </label>
                        <p className="mt-1 font-semibold text-gray-800">
                          {member.phone}
                        </p>
                      </div>
                    </div>
                     
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <label className="text-sm font-medium text-emerald-700">
                        Adresse
                      </label>
                      <p className="mt-1 font-semibold text-gray-800">
                        {member.residential}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 p-0">
                  <CardHeader className="p-5 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white rounded-t-lg">
                    <CardTitle>Formation et Centre</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <label className="text-sm font-medium text-emerald-700">
                        Attestation
                      </label>
                      <p className="mt-1 font-semibold text-gray-800">
                        {member.attestation}
                      </p>
                    </div>
                   
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <label className="text-sm font-medium text-emerald-700">
                        Membre depuis
                      </label>
                      <p className="mt-1 font-semibold text-gray-800">
                        {formatDate(member.createdAt)}
                      </p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <label className="text-sm font-medium text-emerald-700">
                        Dernière mise à jour
                      </label>
                      <p className="mt-1 font-semibold text-gray-800">
                        {formatDate(member.updatedAt)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="planning" className="space-y-6">
              <Card className="shadow-lg border-0 p-0">
                <CardHeader className="p-5 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white rounded-t-lg">
                  <CardTitle>Planning des Visites</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {visits.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">Aucune visite programmée</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {visits.map((visit) => (
                        <div
                          key={visit?.id}
                          className="flex items-center justify-between p-4 border-2 border-emerald-100 rounded-lg hover:bg-emerald-50 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className={`flex items-center justify-center w-12 h-12 rounded-full ${
                                visit?.status ? "bg-emerald-500" : "bg-red-400"
                              }`}
                            >
                              {visit?.status ? (
                                <CheckCircle className="h-6 w-6 text-white" />
                              ) : (
                                <XCircle className="h-6 w-6 text-white" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-lg text-gray-800">
                                {visit?.objetif}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center gap-1">
                                  <CalendarDays className="h-3 w-3" />
                                  {formatDate(visit?.date)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTime(visit?.startTime)} -{" "}
                                  {formatTime(visit?.endTime)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {visit?.location}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge
                            className={
                              visit?.status
                                ? "bg-emerald-100 text-emerald-800 text-sm px-3 py-1"
                                : "bg-orange-100 text-orange-800 text-sm px-3 py-1"
                            }
                          >
                            {visit?.status ? "Terminé" : "En attente"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="purchases" className="space-y-6">
              {purchases.length === 0 ? (
                <Card className="shadow-lg border-0 p-0">
                  <CardContent className="p-8 text-center">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Aucun achat effectué</p>
                  </CardContent>
                </Card>
              ) : (
                purchases.map((purchase) => (
                  <Card key={purchase?.id} className="shadow-lg border-0 p-0">
                    <CardHeader className="p-5 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white rounded-t-lg">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <ShoppingCart className="h-5 w-5" />
                          Commande du {formatDate(purchase?.createdAt)}
                        </CardTitle>
                        <Badge className="bg-white text-emerald-600 text-lg px-4 py-2 font-bold rounded-md ">
                          {purchase?.total?.toLocaleString() ?? 0} DJF
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {(purchase?.purchaseItems ?? []).map((item) => (
                          <div
                            key={item?.id}
                            className="flex items-center space-x-3 p-4 border-2 border-emerald-100 rounded-lg hover:bg-emerald-50 transition-colors"
                          >
                            <img
                              src={item?.image || "/placeholder.svg"}
                              alt={item?.name || "Item"}
                              className="w-16 h-16 object-cover rounded-lg border-2 border-emerald-200"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-800 truncate">
                                {item?.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {item?.quantity ?? 0} ×{" "}
                                {Number.parseInt(
                                  item?.price || "0"
                                ).toLocaleString()}{" "}
                                DJF
                              </p>
                              <p className="text-sm font-bold text-emerald-600">
                                {(
                                  Number.parseInt(item?.price || "0") *
                                  (item?.quantity || 0)
                                ).toLocaleString()}{" "}
                                DJF
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};
export const MLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Profile Section */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Skeleton className="h-7 w-48" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-1">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="w-8 h-8 rounded" />
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">
              <Skeleton className="h-4 w-16" />
            </TabsTrigger>
            <TabsTrigger value="visits">
              <Skeleton className="h-4 w-12" />
            </TabsTrigger>
            <TabsTrigger value="purchases">
              <Skeleton className="h-4 w-16" />
            </TabsTrigger>
            <TabsTrigger value="planning">
              <Skeleton className="h-4 w-16" />
            </TabsTrigger>
            <TabsTrigger value="team">
              <Skeleton className="h-4 w-12" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-5 w-32" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-10 h-10 rounded" />
                          <div>
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Skeleton className="h-5 w-28" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-2 w-full rounded-full" />
                      <div className="grid grid-cols-3 gap-4 text-center">
                        {[...Array(3)].map((_, i) => (
                          <div key={i}>
                            <Skeleton className="h-6 w-8 mx-auto mb-1" />
                            <Skeleton className="h-3 w-12 mx-auto" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-5 w-36" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 border rounded-lg"
                        >
                          <Skeleton className="w-12 h-12 rounded" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-32 mb-1" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Skeleton className="h-5 w-24" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Skeleton className="w-12 h-12 rounded-full" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-28 mb-1" />
                            <Skeleton className="h-3 w-36" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Other tab contents with similar skeleton structure */}
          <TabsContent value="visits" className="space-y-4">
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Skeleton className="w-12 h-12 rounded" />
                        <div>
                          <Skeleton className="h-4 w-32 mb-2" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="purchases" className="space-y-4">
            <div className="grid gap-4">
              {[...Array(2)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="border rounded-lg p-3">
                          <Skeleton className="w-full h-20 rounded mb-2" />
                          <Skeleton className="h-4 w-20 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="planning" className="space-y-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 border rounded-lg"
                    >
                      <Skeleton className="w-10 h-10 rounded" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-36 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-16 h-16 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-3 w-40 mb-1" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
