"use client";
import { useMemo, useState, useEffect, type MouseEvent } from "react"; // Added useEffect
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core//components/ui/card";
import { Button } from "@/core//components/ui/button";
import { Badge } from "@/core//components/ui/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/core//components/ui/avatar";
import {
  CalendarDays,
  Clock,
  Plus,
  CheckCircle,
  Timer,
  Edit,
  Users,
  Calendar,
  X,
} from "lucide-react";

import {
  calculateDurationTime,
  formatDate,
  formatDateShort,
  getDayFromDate,
  isDateInMonth,
  isSameDay,
} from "@/core//lib/utils";
import { useModal } from "@/core//providers/modal-provider";
import CustomModal from "@/core//components/wrappeds/custom-modal";
import { PlanningForm } from "@/core/view/planning/planning-form";
import { usePlanningStore } from "@/core//hooks/store";
import {
  useDeleteVisits,
  useUpdateStatusVisit,
} from "@/core//hooks/use-planning";
import { Spinner } from "@/core//components/ui/spinner";
import { Member, Visits } from "@prisma/client";
import { CrudPermissions } from "@/core/lib/types";

type Props = {
  members: Member[];
  accompanimentId: string;
  userId: string;
  permission: CrudPermissions;
};

export default function PlanningCalendar({
  members,
  accompanimentId,
  userId,
  permission,
}: Props) {
  const { canAdd, canModify, canDelete } = permission;
  const { mutate: updateStatus, isPending: loading } = useUpdateStatusVisit();
  const { planning } = usePlanningStore();
  const { open } = useModal();
  const [planningView, setPlanningView] = useState<"calendar" | "agenda">(
    "calendar"
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedVisit, setSelectedVisit] = useState<Visits | null>(null);
  const [showVisitModal, setShowVisitModal] = useState<boolean>(false);
  const [showMultipleVisitsModal, setShowMultipleVisitsModal] =
    useState<boolean>(false);
  const [multipleVisits, setMultipleVisits] = useState<Visits[]>([]);

  const { mutate: deleteVisit, isPending: loadingDelete } = useDeleteVisits();

  // Effect to handle responsive view change
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Tailwind's 'md' breakpoint is 768px
        setPlanningView("agenda");
      } else {
        setPlanningView("calendar");
      }
    };

    // Set initial view on mount
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount

  const navigateMonth = (direction: number): void => {
    setCurrentMonth((prev: Date) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getMonthName = (date: Date): string => {
    return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  };

  const handleCellClick = (day: number, hasVisit: boolean): void => {
    if (hasVisit) {
      const visits = planning?.visit.filter((v) => {
        return (
          getDayFromDate(v.date) === day && isDateInMonth(v.date, currentMonth)
        );
      })!;
      if (visits.length === 1) {
        setSelectedVisit(visits[0]);
        setShowVisitModal(true);
      } else if (visits.length > 1) {
        setMultipleVisits(visits);
        setShowMultipleVisitsModal(true);
      }
    }
  };

  const closeModal = (): void => {
    setShowVisitModal(false);
    setSelectedVisit(null);
  };

  const visitsByDay = useMemo(() => {
    const map = new Map<number, Visits[]>();
    if (!planning) return map;
    planning.visit.forEach((v) => {
      if (isDateInMonth(v.date, currentMonth)) {
        const day = getDayFromDate(v.date);
        if (!map.has(day)) {
          map.set(day, []);
        }
        map.get(day)!.push(v);
      }
    });
    return map;
  }, [planning, currentMonth]);

  const getVisitsForDay = (day: number): Visits[] => {
    return visitsByDay.get(day) || [];
  };

  const hasVisitOnDay = (day: number): boolean => {
    return getVisitsForDay(day).length > 0;
  };

  const getDayStatus = (day: number): "confirmed" | "pending" | "none" => {
    const visits = getVisitsForDay(day);
    if (visits.length === 0) return "none";
    return visits.every((v) => v.status) ? "confirmed" : "pending";
  };

  const today = new Date();
  const isToday = (day: number): boolean => {
    const dayDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return isSameDay(dayDate, today);
  };

  const renderCalendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayIndex = (firstDayOfMonth.getDay() + 6) % 7; // Adjust to make Monday (1) the start of the week (0-indexed for array)

    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const calendarDays: { day: number; type: "prev" | "current" | "next" }[] =
      [];

    // Add days from previous month
    for (let i = 0; i < startingDayIndex; i++) {
      calendarDays.push({
        day: daysInPrevMonth - (startingDayIndex - 1 - i),
        type: "prev",
      });
    }

    // Add days from current month
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      calendarDays.push({ day: i, type: "current" });
    }

    // Calculate remaining cells to fill a 6x7 grid (42 cells)
    const totalCells = 42;
    const remainingCells = totalCells - calendarDays.length;

    // Add days from next month
    for (let i = 1; i <= remainingCells; i++) {
      calendarDays.push({ day: i, type: "next" });
    }

    return calendarDays;
  }, [currentMonth]);

  return (
    <>
      <div className="space-y-6">
        {/* Modal des détails de visite */}
        {showVisitModal && selectedVisit && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Détails de la session
                  </h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedVisit.status ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    >
                      {selectedVisit.status ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <Timer className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">
                        {formatDate(selectedVisit.date.toDateString())}
                      </h4>
                      <Badge
                        className={
                          selectedVisit.status
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }
                      >
                        {selectedVisit.status ? "Confirmé" : "En attente"}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        HEURE DÉBUT
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedVisit.startTime}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        HEURE FIN
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedVisit.endTime}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      DURÉE
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {calculateDurationTime(
                        selectedVisit.startTime,
                        selectedVisit.endTime
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      objectif
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedVisit.objetif}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      LIEU
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedVisit.location}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      PARTICIPANTS
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {members.slice(0, 3).map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2"
                        >
                          <Avatar className="w-8 h-8 border-2 border-white">
                            <AvatarImage
                              src={
                                member.profile ||
                                "/placeholder.svg?height=32&width=32&query=user profile"
                              }
                              alt={member.name}
                            />
                            <AvatarFallback className="text-xs bg-gray-200">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-700">
                            {member.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Accompagnateur
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div
                        key={planning?.users?.id}
                        className="flex items-center gap-2"
                      >
                        <Avatar className="w-8 h-8 border-2 border-white">
                          <AvatarImage
                            src={
                              planning?.users?.profile ||
                              "/placeholder.svg?height=32&width=32&query=user profile"
                            }
                            alt={planning?.users?.name}
                          />
                          <AvatarFallback className="text-xs bg-gray-200">
                            {planning?.users?.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-700">
                          {planning?.users?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Modal de sélection multiple */}
        {showMultipleVisitsModal && multipleVisits.length > 0 && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowMultipleVisitsModal(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Sessions du{" "}
                    {formatDate(multipleVisits[0].date.toDateString())}
                  </h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowMultipleVisitsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </Button>
                </div>
                <div className="space-y-3">
                  {multipleVisits.map((visit, index) => (
                    <div
                      key={visit.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedVisit(visit);
                        setShowMultipleVisitsModal(false);
                        setShowVisitModal(true);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            visit.status ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        >
                          {visit.status ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            <Timer className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            Session {index + 1}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {visit.startTime} - {visit.endTime}
                          </p>
                          <p className="text-sm text-gray-500">
                            {visit.objetif}
                          </p>
                          <p className="text-xs text-gray-400">
                            {visit.location}
                          </p>
                        </div>
                        <Badge
                          className={
                            visit.status
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }
                        >
                          {visit.status ? "Confirmé" : "En attente"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* En-tête du planning */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Planning des visites
            </h2>
            <p className="text-gray-600 mt-1">
              Calendrier des sessions d'accompagnement
            </p>
          </div>
          <div className="flex gap-3">
            {/* Only show calendar button on larger screens */}
            <Button
              variant={planningView === "calendar" ? "default" : "outline"}
              className={`gap-2 hidden md:flex ${
                planningView === "calendar"
                  ? "bg-purple-600 text-white"
                  : "bg-transparent"
              }`}
              onClick={() => setPlanningView("calendar")}
            >
              <CalendarDays className="w-4 h-4" />
              Vue mensuelle
            </Button>
            <Button
              variant={planningView === "agenda" ? "default" : "outline"}
              className={`gap-2 ${
                planningView === "agenda"
                  ? "bg-purple-600 text-white"
                  : "bg-transparent"
              }`}
              onClick={() => setPlanningView("agenda")}
            >
              <Clock className="w-4 h-4" />
              Vue agenda
            </Button>
            {canAdd && (
              <Button
                onClick={() => {
                  open(
                    <CustomModal>
                      <PlanningForm
                        details={{ ...planning!, visit: [] }}
                        accompanimentId={accompanimentId}
                        userId={userId}
                      />
                    </CustomModal>
                  );
                }}
                className="bg-purple-600 hover:bg-purple-700 gap-2"
              >
                <Plus className="w-4 h-4" />
                Planifier une visite
              </Button>
            )}
          </div>
        </div>
        {/* Calendrier Mensuel */}
        {planningView === "calendar" && (
          <Card className="border-0 shadow-sm p-0">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg p-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold capitalize">
                  {getMonthName(currentMonth)}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => navigateMonth(-1)}
                  >
                    ←
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => navigateMonth(1)}
                  >
                    →
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* En-têtes des jours */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
                  (day) => (
                    <div
                      key={day}
                      className="p-3 text-center font-semibold text-gray-600 bg-gray-50 rounded-lg"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>
              {/* Grille du calendar */}
              <div className="grid grid-cols-7 gap-2">
                {renderCalendarDays.map(({ day, type }) => {
                  const hasVisit =
                    type === "current" ? hasVisitOnDay(day) : false;
                  const dayStatus =
                    type === "current" ? getDayStatus(day) : "none";
                  const isConfirmed = dayStatus === "confirmed";
                  const todayCheck = type === "current" ? isToday(day) : false;
                  const visitsForDay =
                    type === "current" ? getVisitsForDay(day) : [];

                  return (
                    <div
                      key={`${type}-${day}`}
                      className={`h-28 p-2 rounded-lg border transition-all duration-200 hover:shadow-md ${
                        type === "prev" || type === "next"
                          ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
                          : todayCheck
                          ? "bg-blue-50 border-blue-300 ring-2 ring-blue-200 cursor-pointer"
                          : hasVisit
                          ? isConfirmed
                            ? "bg-emerald-50 border-emerald-300 hover:bg-emerald-100 cursor-pointer"
                            : "bg-amber-50 border-amber-300 hover:bg-amber-100 cursor-pointer"
                          : "bg-white border-gray-200 hover:bg-gray-50 cursor-pointer"
                      }`}
                      onClick={() =>
                        type === "current" && handleCellClick(day, hasVisit)
                      }
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-sm font-medium ${
                            todayCheck ? "text-blue-600" : "text-gray-900"
                          }`}
                        >
                          {day}
                        </span>
                        {todayCheck && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      {type === "current" &&
                        hasVisit &&
                        visitsForDay.length > 0 && (
                          <div className="space-y-1">
                            {visitsForDay.slice(0, 2).map((visit) => (
                              <div key={visit.id} className="space-y-1">
                                <div
                                  className={`text-xs p-1 rounded text-center font-medium ${
                                    visit.status
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {visit.startTime} - {visit.endTime}
                                </div>
                              </div>
                            ))}
                            {visitsForDay.length > 2 && (
                              <div className="text-xs text-center text-gray-500 font-medium">
                                +{visitsForDay.length - 2} autre
                                {visitsForDay.length - 2 > 1 ? "s" : ""}
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
        {/* Vue Agenda */}
        {planningView === "agenda" && (
          <Card className="border-0 shadow-sm !p-0">
            <CardHeader className="p-5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-xl font-bold">
                Vue Agenda - {getMonthName(currentMonth)}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {planning?.visit.map((visit) => (
                  <div
                    key={visit.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() =>
                      handleCellClick(getDayFromDate(visit.date), true)
                    }
                  >
                    <div
                      className={`w-4 h-4 rounded-full ${
                        visit.status ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {formatDate(visit.date.toDateString())}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {visit.startTime} - {visit.endTime}
                      </p>
                    </div>
                    <Badge
                      className={
                        visit.status
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }
                    >
                      {visit.status ? "Confirmé" : "En attente"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        {/* Légende */}
        <div className="flex items-center justify-center gap-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-200 rounded border-2 border-blue-300"></div>
            <span className="text-sm text-gray-600">Aujourd'hui</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-200 rounded border-2 border-emerald-300"></div>
            <span className="text-sm text-gray-600">Session confirmée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-200 rounded border-2 border-amber-300"></div>
            <span className="text-sm text-gray-600">Session en attente</span>
          </div>
        </div>
        {/* Liste détaillée des sessions */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">
            Sessions programmées
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {planning?.visit.map((visit, index) => (
              <Card
                key={visit.id}
                className={`border-0 shadow-sm hover:shadow-md transition-all duration-300 ${
                  visit.status
                    ? "bg-gradient-to-r from-emerald-50 to-emerald-100 border-3 border-emerald-500"
                    : "bg-gradient-to-r from-amber-50 to-amber-100 border-3 border-amber-500"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${
                          visit.status
                            ? "bg-gradient-to-br from-emerald-400 to-emerald-600"
                            : "bg-gradient-to-br from-amber-400 to-amber-600"
                        }`}
                      >
                        {visit.status ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <Timer className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900">
                          {formatDateShort(visit.date)}
                        </h4>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">
                            {visit.startTime} - {visit.endTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        className={`${
                          visit.status
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {visit.status ? "Confirmé" : "En attente"}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white/70 hover:bg-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* Détails de la session */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-white/70 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        DURÉE
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {calculateDurationTime(visit.startTime, visit.endTime)}
                      </p>
                    </div>
                    <div className="p-3 bg-white/70 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        TYPE
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {visit.objetif}
                      </p>
                    </div>
                  </div>
                  {/* Participants */}
                  <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                    <Users className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        PARTICIPANTS
                      </p>
                      <div className="flex -space-x-2">
                        {members.slice(0, 2).map((member) => (
                          <Avatar
                            key={member.id}
                            className="w-6 h-6 border-2 border-white"
                          >
                            <AvatarImage
                              src={
                                member.profile ||
                                "/placeholder.svg?height=24&width=24&query=user profile"
                              }
                              alt={member.name}
                            />
                            <AvatarFallback className="text-xs bg-gray-200">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {members.length > 2 && (
                          <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              +{members.length - 2}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Actions rapides */}
                  <div className="flex gap-2 mt-4">
                    {canDelete && (
                      <Button
                        disabled={loadingDelete}
                        onClick={() =>
                          deleteVisit({ param: { visitId: visit.id! } })
                        }
                        className="flex-1 bg-red/70 hover:bg-white text-red-700 border border-red-200 cursor-pointer"
                      >
                        {loadingDelete ? (
                          <Spinner variant="ellipsis" />
                        ) : visit.status ? (
                          <X className="w-4 h-4 mr-2" />
                        ) : (
                          <CalendarDays className="w-4 h-4 mr-2" />
                        )}
                        Supprimer
                      </Button>
                    )}

                    {canModify && (
                      <Button
                        disabled={loading}
                        onClick={() =>
                          updateStatus({
                            param: { plangId: visit.id! },
                            json: { status: !visit.status },
                          })
                        }
                        className={`flex-1 text-white cursor-pointer ${
                          visit.status
                            ? "bg-red-600 hover:bg-red-700 "
                            : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                      >
                        {visit.status ? "Annuler" : "Confirmer"}
                        {loading ? (
                          <Spinner variant="ellipsis" />
                        ) : visit.status ? (
                          <X className="w-4 h-4 mr-2" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {/* Statistiques du planning */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-2xl text-purple-900 mb-1">
                {planning?.visit.length || 0}
              </h4>
              <p className="text-purple-700 text-sm font-medium">
                Sessions totales
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-2xl text-emerald-900 mb-1">
                {planning?.visit.filter((v) => v.status).length || 0}
              </h4>
              <p className="text-emerald-700 text-sm font-medium">
                Sessions confirmées
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Timer className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-2xl text-amber-900 mb-1">
                {planning?.visit.filter((v) => !v.status).length || 0}
              </h4>
              <p className="text-amber-700 text-sm font-medium">En attente</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
