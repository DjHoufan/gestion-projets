"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Users,
  List,
  Search,
  Plus,
  Grid3X3,
  X,
} from "lucide-react";
import { Input } from "@/core/components/ui/input";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import { useGetPlanning } from "@/core/hooks/use-planning";
import { Spinner } from "@/core/components/ui/spinner";

export const PlanningBody = () => {
  const { data, isPending } = useGetPlanning();

  const [seeMore, setseeMore] = useState<number>(3);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVisit, setSelectedVisit] = useState<any>(null);

  // Flatten all visits from all plannings
  const allVisits = useMemo(() => {
    if (!data) return [];

    return data.flatMap((planning) =>
      planning.visit.map((visit) => ({
        ...visit,
        planning,
        accompaniment: planning.accompaniments[0],
      }))
    );
  }, [data]);
  // Filter visits based on search term
  const filteredVisits = allVisits.filter(
    (visit) =>
      visit.objetif.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get visits for a specific date
  const getVisitsForDate = (date: Date) => {
    return filteredVisits.filter((visit) => {
      const visitDate = new Date(visit.date);
      return visitDate.toDateString() === date.toDateString();
    });
  };

  // Get current month visits or visits for selected date
  const getCurrentMonthVisits = () => {
    if (selectedDate) {
      return getVisitsForDate(selectedDate);
    }
    return filteredVisits.filter((visit) => {
      const visitDate = new Date(visit.date);
      return (
        visitDate.getMonth() === currentDate.getMonth() &&
        visitDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const daysOfWeek = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const calendarDays = generateCalendarDays();

  // Group visits by date for different views
  const groupedVisits = getCurrentMonthVisits().reduce((groups, visit) => {
    const date = new Date(visit.date).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(visit);
    return groups;
  }, {} as Record<string, typeof allVisits>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Planning Manager
              </h1>
              <p className="text-slate-600 mt-1">
                Gérez vos visites et rendez-vous
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Rechercher une visite..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 bg-white/70 border-emerald-200 focus:border-emerald-400 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-1">
            <Card className="p-0 bg-white/70 backdrop-blur-sm border-emerald-100 rounded-2xl overflow-hidden sticky top-32">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="p-5 text-xl font-bold text-slate-800">
                    {monthNames[currentDate.getMonth()]}{" "}
                    {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth("prev")}
                      className="rounded border-emerald-200 hover:bg-emerald-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth("next")}
                      className="rounded border-emerald-200 hover:bg-emerald-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-bold text-slate-600 p-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 ">
                  {calendarDays.map((day, index) => {
                    const isCurrentMonth =
                      day.getMonth() === currentDate.getMonth();
                    const isToday =
                      day.toDateString() === new Date().toDateString();
                    const dayVisits = getVisitsForDate(day);
                    const isSelected =
                      selectedDate?.toDateString() === day.toDateString();

                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(day)}
                        className={`relative p-4 text-sm rounded transition-all duration-200 min-h-[50px]   ${
                          !isCurrentMonth
                            ? "text-slate-300"
                            : isSelected
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transform scale-105"
                            : isToday
                            ? "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 font-bold border-2 border-emerald-300"
                            : "text-slate-700 hover:bg-emerald-50 hover:scale-105"
                        }`}
                      >
                        <div className="font-semibold">{day.getDate()}</div>
                        {dayVisits.length > 0 && (
                          <div className="absolute top-0 right-0">
                            <div
                              className={`w-4 h-4 flex justify-center items-center  bg-orange-500 text-[10px] text-white ${
                                isSelected || isToday
                                  ? " rounded-tr rounded-bl "
                                  : " rounded"
                              }`}
                            >
                              {dayVisits.length}
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t border-emerald-100">
                  <h4 className="font-bold text-slate-800 mb-4">Résumé</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        {selectedDate
                          ? selectedDate.toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                            })
                          : "Ce mois"}
                      </span>
                      <span className="font-bold text-emerald-600">
                        {getCurrentMonthVisits().length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Confirmées</span>
                      <span className="font-semibold text-green-600">
                        {getCurrentMonthVisits().filter((v) => v.status).length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">En attente</span>
                      <span className="font-semibold text-orange-600">
                        {
                          getCurrentMonthVisits().filter((v) => !v.status)
                            .length
                        }
                      </span>
                    </div>
                  </div>

                  {selectedDate && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDate(undefined)}
                      className="w-full mt-4 rounded-full border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                    >
                      Voir tout le mois
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Section */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {selectedDate
                      ? selectedDate.toLocaleDateString("fr-FR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "Toutes les visites"}
                  </h2>
                  <p className="text-slate-600 mt-1">
                    {getCurrentMonthVisits().length} visite(s) programmée(s)
                  </p>
                </div>

                <div className="flex items-center space-x-1 bg-white rounded p-1 shadow-sm border border-emerald-100">
                  {[
                    { mode: "grid", icon: Grid3X3, label: "Grille" },
                    { mode: "list", icon: List, label: "Liste" },
                  ].map(({ mode, icon: Icon, label }) => (
                    <Button
                      key={mode}
                      variant={viewMode === mode ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode(mode as any)}
                      className={`rounded-[0.30rem] px-4 ${
                        viewMode === mode
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                          : "hover:bg-emerald-50"
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Content based on view mode */}
              {isPending ? (
                <div className="w-full h-80 flex justify-center items-center">
                  <Spinner size={50} variant="bars" className="text-primary" />
                </div>
              ) : (
                <ScrollArea className="h-[700px] px-5">
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      {Object.entries(groupedVisits).map(([date, visits]) => (
                        <Card
                          key={date}
                          className="p-0 bg-white/70 backdrop-blur-sm border-emerald-100  transition-all duration-300 rounded-2xl overflow-hidden"
                        >
                          <CardHeader className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg font-bold text-slate-800">
                                {new Date(date).toLocaleDateString("fr-FR", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "short",
                                })}
                              </CardTitle>
                              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full">
                                {visits.length}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className=" space-y-4">
                            {visits.slice(0, seeMore).map((visit) => (
                              <div
                                key={visit.id}
                                onClick={() => setSelectedVisit(visit)}
                                className="p-4 rounded-xl bg-gradient-to-r from-white to-emerald-50/30 border border-emerald-100 hover:border-emerald-200 cursor-pointer transition-all duration-200 hover:shadow-md"
                              >
                                <div className="mb-4 flex justify-between items-center">
                                  <h4 className="font-semibold">
                                    {visit.accompaniment.project.name}
                                  </h4>
                                  <h5 className="border px-5 py-1 rounded  border-emerald-500 text-xs">
                                    {visit.accompaniment.name}
                                  </h5>
                                </div>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm font-bold text-slate-700 bg-emerald-100 px-3 py-1 rounded-full">
                                    {visit.startTime} - {visit.endTime}
                                  </span>
                                  <Badge
                                    variant={
                                      visit.status ? "default" : "secondary"
                                    }
                                    className={`text-xs rounded-full ${
                                      visit.status
                                        ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                                        : "bg-gradient-to-r from-orange-400 to-amber-500 text-white"
                                    }`}
                                  >
                                    {visit.status ? "Confirmé" : "En attente"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-700 font-medium mb-2">
                                  {visit.objetif}
                                </p>
                                <div className="flex items-center text-xs text-slate-500">
                                  <MapPin className="h-3 w-3 mr-2" />
                                  {visit.location}
                                </div>
                              </div>
                            ))}
                            {visits.length > 3 && (
                              <Button
                                onClick={() => {
                                  if (seeMore > 3) {
                                    setseeMore(3);
                                  } else {
                                    setseeMore(visits.length);
                                  }
                                }}
                                variant="ghost"
                                size="sm"
                                className="w-full rounded-xl hover:bg-emerald-50"
                              >
                                {seeMore > 3
                                  ? "voir moins"
                                  : ` Voir ${visits.length - 3} de plus`}
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getCurrentMonthVisits().map((visit) => (
                        <Card
                          key={visit.id}
                          className="bg-white/70 backdrop-blur-sm border-emerald-100 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-6">
                                <div className="text-center bg-gradient-to-r from-emerald-100 to-teal-100 rounded-md p-4">
                                  <div className="text-2xl font-bold text-slate-800">
                                    {new Date(visit.date).getDate()}
                                  </div>
                                  <div className="text-xs text-slate-500 uppercase font-semibold">
                                    {new Date(visit.date).toLocaleDateString(
                                      "fr-FR",
                                      { month: "short" }
                                    )}
                                  </div>
                                </div>

                                <div className="flex-1">
                                  <div className="flex justify-between gap-5 items-center">
                                    <h4 className="font-semibold">
                                      {visit.accompaniment.project.name}
                                    </h4>
                                    <h5 className="border px-5 py-1 rounded  border-emerald-500 text-xs">
                                      {visit.accompaniment.name}
                                    </h5>
                                    <h3 className="font-bold text-lg text-slate-800 mb-2">
                                      Objectif : {visit.objetif}
                                    </h3>
                                  </div>
                                  <div className="flex items-center space-x-6 text-sm text-slate-600">
                                    <div className="flex items-center bg-emerald-50 px-3 py-1 rounded-full">
                                      <Clock className="h-4 w-4 mr-2" />
                                      {visit.startTime} - {visit.endTime}
                                    </div>
                                    <div className="flex items-center bg-emerald-50 px-3 py-1 rounded-full">
                                      <MapPin className="h-4 w-4 mr-2" />
                                      {visit.location}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <Badge
                                  variant={
                                    visit.status ? "default" : "secondary"
                                  }
                                  className={`px-4 py-2 rounded-full font-semibold ${
                                    visit.status
                                      ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                                      : "bg-gradient-to-r from-orange-400 to-amber-500 text-white"
                                  }`}
                                >
                                  {visit.status ? "Confirmé" : "En attente"}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for visit details */}
      {selectedVisit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl p-0">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-slate-800">
                  Détails de la visite
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedVisit(null)}
                  className="rounded-full hover:bg-emerald-100"
                >
                  <X />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex justify-between w-full ">
                <h4 className="font-bold text-xl text-slate-800 mb-3">
                  {selectedVisit.objetif}
                </h4>
                <Badge
                  variant={selectedVisit.status ? "default" : "secondary"}
                  className={`px-7 py-2 border-none rounded-md font-semibold ${
                    selectedVisit.status
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                      : "bg-gradient-to-r from-orange-500 to-amber-600 text-white"
                  }`}
                >
                  {selectedVisit.status ? "Confirmé" : "En attente"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">
                      {new Date(selectedVisit.date).toLocaleDateString("fr-FR")}
                    </div>
                    <div className="text-sm text-slate-600 font-medium">
                      {selectedVisit.startTime} - {selectedVisit.endTime}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Lieu</div>
                    <div className="text-sm text-slate-600 font-medium">
                      {selectedVisit.location}
                    </div>
                  </div>
                </div>
              </div>

              {selectedVisit.accompaniment && (
                <div className="border-t border-emerald-100 pt-6">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    Accompagnement
                  </h4>
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
                        <AvatarImage
                          src={
                            selectedVisit.accompaniment.users.profile ||
                            "/placeholder.svg"
                          }
                        />
                        <AvatarFallback className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold text-lg">
                          {selectedVisit.accompaniment.users.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold text-slate-800 text-lg">
                          {selectedVisit.accompaniment.users.name}
                        </div>
                        <div className="text-sm text-slate-600">
                          {selectedVisit.accompaniment.users.email}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <span className="font-bold text-slate-700 block mb-1">
                          Projet:
                        </span>
                        <div className="text-slate-600">
                          {selectedVisit.accompaniment.name}
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <span className="font-bold text-slate-700 block mb-1">
                          Budget:
                        </span>
                        <div className="text-slate-600 font-semibold">
                          {selectedVisit.accompaniment.budget.toLocaleString()}{" "}
                          Fdj
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
