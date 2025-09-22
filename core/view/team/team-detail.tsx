"use client";
import { useGetOnTeam } from "@/core/hooks/use-teams";
import { IdType } from "@/core/lib/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Badge } from "@/core/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Separator } from "@/core/components/ui/separator";
import {
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
  AlertTriangle,
  Calendar,
  Building,
} from "lucide-react";
import { calculerAge, cn, formatDate } from "@/core/lib/utils";

import {
  AccompagnementsSkeleton,
  ConflitsSkeleton,
  InformationsSkeleton,
  PlanningsSkeleton,
} from "@/core/view/team/skeleton";
import { Button } from "@/core/components/ui/button";
import { useScrollSpy } from "@/core/hooks/use-scroll-spy";

export const TeamDetail = ({ Id }: IdType) => {
  const { data, isPending: isLoading } = useGetOnTeam(Id);

  const sectionIds = [
    "informations",
    "conflits",
    "plannings",
    "accompagnements",
  ];
  const activeSection = useScrollSpy(sectionIds, 200)

  const navigationItems = [
    {
      id: "informations",
      label: "Informations",
      icon: User,
      color: "text-blue-400",
    },
    {
      id: "conflits",
      label: "Conflits",
      icon: AlertTriangle,
      color: "text-red-400",
      count: data?.conflit.length,
    },
    {
      id: "plannings",
      label: "Plannings",
      icon: Calendar,
      color: "text-green-400",
      count: data?.plannings.length,
    },
    {
      id: "accompagnements",
      label: "Accompagnements",
      icon: Building,
      color: "text-purple-400",
      count: data?.accompaniments.length,
    },
  ];

 const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerHeight = 80
      const elementPosition = element.offsetTop - headerHeight
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="min-h-screen ">
      {/* Fixed Sidebar */}
      <div className="fixed h-screen w-80   bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900  text-slate-300 p-6 overflow-y-auto">
        <div className="sticky top-0">
          {/* Profile Section */}
          <div className="text-center mb-8">
            <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-blue-500/20 shadow-2xl">
              <AvatarImage
                src={data?.profile || "/placeholder.svg"}
                alt={data?.name}
              />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                {data?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className=" bg-gradient-to-r from-teal-500/10 to-teal-500/10 backdrop-blur-sm rounded-xl p-4 mb-4 border border-slate-600/30">
              <h1 className="text-2xl font-bold text-balance mb-2 text-white">
                {data?.name}
              </h1>
              <p className="text-lg text-slate-300 mb-3">Accompagnateur</p>
              <Badge
                variant={data?.status === "enabled" ? "default" : "secondary"}
                className={cn(
                  "text-sm font-medium",
                  data?.status === "enabled"
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                )}
              >
                {data?.status === "enabled" ? "Terminer" : "En cours .."}
              </Badge>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "w-full justify-start gap-3 px-4 py-3 h-auto text-left transition-all duration-200",
                    isActive
                      ? "bg-slate-700/50 text-white border border-slate-600/50 shadow-lg"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      isActive ? item.color : "text-slate-500"
                    )}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.count !== undefined && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        isActive
                          ? "bg-slate-600 text-white"
                          : "bg-slate-700 text-slate-300"
                      )}
                    >
                      {item.count}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="ml-80 space-y-8 p-8">
        {/* Informations Section */}
        <section id="informations">
          {isLoading || !data ? (
            <InformationsSkeleton />
          ) : (
            <Card className="!p-0 hadow-lg border border-gray-200 overflow-hidden bg-white">
              <CardHeader className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <User className="w-6 h-6" />
                  </div>
                  Informations Personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pb-5 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{data.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Téléphone</p>
                      <p className="font-medium text-gray-900">{data.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Adresse</p>
                      <p className="font-medium text-gray-900">
                        {data.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarDays className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Âge</p>
                      <p className="font-medium text-gray-900">
                        {calculerAge(data.dob)} ans
                      </p>
                    </div>
                  </div>
                </div>
                <Separator className="bg-gray-200" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Genre</p>
                    <p className="font-medium capitalize text-gray-900">
                      {data.gender}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Type</p>
                    <p className="font-medium capitalize text-gray-900">
                      {data.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Créé le</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(data.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Mis à jour le</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(data.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Conflits Section */}
        <section id="conflits">
          {isLoading || !data ? (
            <ConflitsSkeleton />
          ) : (
            <Card className="!p-0 shadow-lg border border-gray-200 overflow-hidden bg-white">
              <CardHeader className="p-6 bg-gradient-to-r from-red-500 to-red-600 text-white">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  Conflits ({data.conflit.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-5 bg-white">
                {data.conflit.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Aucun conflit enregistré
                  </p>
                ) : (
                  <div className="space-y-4">
                    {data.conflit.map((conflict) => (
                      <div
                        key={conflict.id}
                        className="bg-red-50 rounded-xl p-6 space-y-4 shadow-sm border border-red-100"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-balance text-gray-900">
                              {conflict.nature}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              Créé le {formatDate(conflict.createdAt)}
                            </p>
                          </div>
                          <Badge
                            variant={conflict.status ? "default" : "secondary"}
                            className={cn(
                              "text-white font-medium",
                              conflict.status ? "bg-green-500" : "bg-red-500"
                            )}
                          >
                            {conflict.status ? "Résolu" : "En cours"}
                          </Badge>
                        </div>
                        {conflict.resolution && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Résolution:
                            </p>
                            <p className="text-sm text-gray-800">
                              {conflict.resolution}
                            </p>
                          </div>
                        )}
                        {conflict.partieImpliques.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-2">
                              Parties impliquées:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {conflict.partieImpliques.map((partie, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs border-red-200 text-red-700 bg-red-50"
                                >
                                  {partie.name} ({partie.role})
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </section>

        {/* Plannings Section */}
        <section id="plannings">
          {isLoading || !data ? (
            <PlanningsSkeleton />
          ) : (
            <Card className="!p-0 shadow-lg border border-gray-200 overflow-hidden bg-white">
              <CardHeader className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Calendar className="w-6 h-6" />
                  </div>
                  Plannings ({data.plannings.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-5 bg-white">
                {data.plannings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Aucun planning enregistré
                  </p>
                ) : (
                  <div className="space-y-6">
                    {data.plannings.map((planning, index) => (
                      <div
                        key={planning.id}
                        className="bg-green-50 rounded-xl p-6 space-y-4 shadow-sm border border-green-100"
                      >
                        <h4 className="font-semibold text-green-700">
                          Planning #{index + 1}
                        </h4>

                        {planning.accompaniments.map((acc) => (
                          <div
                            key={acc.id}
                            className="bg-white rounded-lg p-4 space-y-3 border border-green-200"
                          >
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-gray-900">
                                {acc.name}
                              </h5>
                              <Badge
                                variant="outline"
                                className="border-green-300 text-green-700 bg-green-50"
                              >
                                {acc.members.length} membres
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {acc.adresse}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {acc.phones.map((phone, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs bg-green-100 text-green-700 border-green-200"
                                >
                                  {phone}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}

                        {planning.visit.length > 0 && (
                          <div>
                            <h5 className="font-medium mb-3 text-gray-900">
                              Visites programmées:
                            </h5>
                            {planning.visit.map((visit) => (
                              <div
                                key={visit.id}
                                className="bg-white rounded-lg p-4 space-y-2 border border-green-200"
                              >
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-gray-900">
                                    {visit.objetif}
                                  </p>
                                  <Badge
                                    variant={
                                      visit.status ? "default" : "secondary"
                                    }
                                    className={
                                      visit.status
                                        ? "bg-green-600 text-white"
                                        : "bg-orange-500 text-white"
                                    }
                                  >
                                    {visit.status ? "Effectuée" : "Programmée"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {formatDate(visit.date)} • {visit.startTime} -{" "}
                                  {visit.endTime}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {visit.location}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </section>

        {/* Accompagnements Section */}
        <section id="accompagnements">
          {isLoading || !data ? (
            <AccompagnementsSkeleton />
          ) : (
            <Card className="!p-0 shadow-lg border border-gray-200 overflow-hidden bg-white">
              <CardHeader className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Building className="w-6 h-6" />
                  </div>
                  Accompagnements ({data.accompaniments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-5 bg-white">
                {data.accompaniments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Aucun accompagnement enregistré
                  </p>
                ) : (
                  <div className="space-y-6">
                    {data.accompaniments.map((acc) => (
                      <div
                        key={acc.id}
                        className="bg-purple-50 rounded-xl p-6 space-y-4 shadow-sm border border-purple-100"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-balance text-gray-900">
                              {acc.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {acc.adresse}
                            </p>
                            {acc.project && (
                              <p className="text-sm text-gray-600 mt-1">
                                Projet: {acc.project.name} • {acc.project.local}
                              </p>
                            )}
                          </div>
                          <Badge
                            variant={acc.status ? "default" : "secondary"}
                            className={
                              acc.status
                                ? "bg-purple-600 text-white"
                                : "bg-gray-400 text-white"
                            }
                          >
                            {acc.status ? "Terminer" : "En cours ..."}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {acc.phones.map((phone, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs border-purple-200 text-purple-700 bg-purple-50"
                            >
                              <Phone className="w-3 h-3 mr-1" />
                              {phone}
                            </Badge>
                          ))}
                        </div>

                        {acc.members.length > 0 && (
                          <div>
                            <h5 className="font-medium mb-3 flex items-center gap-2 text-purple-700">
                              <Users className="w-4 h-4" />
                              Membres ({acc.members.length})
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {acc.members.map((member) => (
                                <div
                                  key={member.id}
                                  className="bg-white rounded-lg p-4 space-y-2 border border-purple-200"
                                >
                                  <p className="font-medium text-gray-900">
                                    {member.name}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {member.phone}
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    <Badge
                                      variant="outline"
                                      className="text-xs border-purple-200 text-purple-700 bg-purple-50"
                                    >
                                      {member.commune}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-xs border-purple-200 text-purple-700 bg-purple-50"
                                    >
                                      {member.language}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-xs border-purple-200 text-purple-700 bg-purple-50"
                                    >
                                      {member.attestation}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
};
