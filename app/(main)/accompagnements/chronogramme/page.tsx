"use client";


import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Calendar } from "lucide-react";

interface Cohorte {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  color: string;
  bgColor: string;
  borderColor: string;
}
 

interface Activity {
  id: string;
  activity: string;
  startDate: Date;
  endDate: Date;
  color: string;
  bgColor: string;
  category: string;
}

const ACTIVITIES: Activity[] = [
  {
    id: "a1",
    activity: "Séances orientation C2",
    startDate: new Date("2025-09-15"),
    endDate: new Date("2025-09-15"),
    color: "text-indigo-600",
    bgColor: "bg-indigo-400",
    category: "Orientation",
  },
  {
    id: "a2",
    activity: "Transfert CPEC C2 (1ère)",
    startDate: new Date("2025-09-21"),
    endDate: new Date("2025-09-21"),
    color: "text-emerald-600",
    bgColor: "bg-emerald-400",
    category: "Transfert",
  },
  {
    id: "a3",
    activity: "C2 - 1ère tranche",
    startDate: new Date("2025-09-22"),
    endDate: new Date("2025-09-25"),
    color: "text-green-600",
    bgColor: "bg-green-400",
    category: "Tranche",
  },
  {
    id: "a4",
    activity: "Séances orientation C3",
    startDate: new Date("2025-09-23"),
    endDate: new Date("2025-09-23"),
    color: "text-indigo-600",
    bgColor: "bg-indigo-400",
    category: "Orientation",
  },
  {
    id: "a5",
    activity: "Transfert CPEC C3 (1ère)",
    startDate: new Date("2025-09-26"),
    endDate: new Date("2025-09-26"),
    color: "text-emerald-600",
    bgColor: "bg-emerald-400",
    category: "Transfert",
  },
  {
    id: "a6",
    activity: "Demande subvention T2 C2 & C3",
    startDate: new Date("2025-09-29"),
    endDate: new Date("2025-09-29"),
    color: "text-amber-600",
    bgColor: "bg-amber-400",
    category: "Admin",
  },
  {
    id: "a7",
    activity: "Remise pièces C2",
    startDate: new Date("2025-09-30"),
    endDate: new Date("2025-09-30"),
    color: "text-rose-600",
    bgColor: "bg-rose-400",
    category: "Justificatif",
  },
  {
    id: "a8",
    activity: "Séances orientation C4",
    startDate: new Date("2025-09-30"),
    endDate: new Date("2025-09-30"),
    color: "text-indigo-600",
    bgColor: "bg-indigo-400",
    category: "Orientation",
  },
  {
    id: "a9",
    activity: "Réunion comité C2",
    startDate: new Date("2025-10-02"),
    endDate: new Date("2025-10-02"),
    color: "text-violet-600",
    bgColor: "bg-violet-400",
    category: "Comité",
  },
  {
    id: "a10",
    activity: "Remise pièces C3",
    startDate: new Date("2025-10-07"),
    endDate: new Date("2025-10-07"),
    color: "text-rose-600",
    bgColor: "bg-rose-400",
    category: "Justificatif",
  },
  {
    id: "a11",
    activity: "Séances orientation C5",
    startDate: new Date("2025-10-08"),
    endDate: new Date("2025-10-08"),
    color: "text-indigo-600",
    bgColor: "bg-indigo-400",
    category: "Orientation",
  },
  {
    id: "a12",
    activity: "Réunion comité C3",
    startDate: new Date("2025-10-09"),
    endDate: new Date("2025-10-09"),
    color: "text-violet-600",
    bgColor: "bg-violet-400",
    category: "Comité",
  },
  {
    id: "a13",
    activity: "C2 - 2ème tranche",
    startDate: new Date("2025-10-13"),
    endDate: new Date("2025-10-16"),
    color: "text-green-600",
    bgColor: "bg-green-400",
    category: "Tranche",
  },
  {
    id: "a14",
    activity: "Demande subvention T1 C4 & C5",
    startDate: new Date("2025-10-16"),
    endDate: new Date("2025-10-16"),
    color: "text-amber-600",
    bgColor: "bg-amber-400",
    category: "Admin",
  },
  {
    id: "a15",
    activity: "C3 - 2ème tranche",
    startDate: new Date("2025-10-20"),
    endDate: new Date("2025-10-23"),
    color: "text-purple-600",
    bgColor: "bg-purple-400",
    category: "Tranche",
  },
  {
    id: "a16",
    activity: "Clôture C2",
    startDate: new Date("2025-10-24"),
    endDate: new Date("2025-10-24"),
    color: "text-red-600",
    bgColor: "bg-red-400",
    category: "Clôture",
  },
  {
    id: "a17",
    activity: "C4 - 1ère tranche",
    startDate: new Date("2025-10-26"),
    endDate: new Date("2025-10-30"),
    color: "text-orange-600",
    bgColor: "bg-orange-400",
    category: "Tranche",
  },
  {
    id: "a18",
    activity: "Demande subvention T2 C4 & C5",
    startDate: new Date("2025-10-30"),
    endDate: new Date("2025-10-30"),
    color: "text-amber-600",
    bgColor: "bg-amber-400",
    category: "Admin",
  },
  {
    id: "a19",
    activity: "Clôture C3",
    startDate: new Date("2025-11-01"),
    endDate: new Date("2025-11-01"),
    color: "text-red-600",
    bgColor: "bg-red-400",
    category: "Clôture",
  },
  {
    id: "a20",
    activity: "C5 - 1ère tranche",
    startDate: new Date("2025-11-02"),
    endDate: new Date("2025-11-04"),
    color: "text-pink-600",
    bgColor: "bg-pink-400",
    category: "Tranche",
  },
  {
    id: "a21",
    activity: "Remise pièces C4",
    startDate: new Date("2025-11-04"),
    endDate: new Date("2025-11-04"),
    color: "text-rose-600",
    bgColor: "bg-rose-400",
    category: "Justificatif",
  },
  {
    id: "a22",
    activity: "Réunion comité C4",
    startDate: new Date("2025-11-06"),
    endDate: new Date("2025-11-06"),
    color: "text-violet-600",
    bgColor: "bg-violet-400",
    category: "Comité",
  },
  {
    id: "a23",
    activity: "Remise pièces C5",
    startDate: new Date("2025-11-09"),
    endDate: new Date("2025-11-09"),
    color: "text-rose-600",
    bgColor: "bg-rose-400",
    category: "Justificatif",
  },
  {
    id: "a24",
    activity: "C4 - 2ème tranche",
    startDate: new Date("2025-11-09"),
    endDate: new Date("2025-11-13"),
    color: "text-orange-600",
    bgColor: "bg-orange-400",
    category: "Tranche",
  },
  {
    id: "a25",
    activity: "Réunion comité C5",
    startDate: new Date("2025-11-11"),
    endDate: new Date("2025-11-11"),
    color: "text-violet-600",
    bgColor: "bg-violet-400",
    category: "Comité",
  },
  {
    id: "a26",
    activity: "C5 - 2ème tranche",
    startDate: new Date("2025-11-16"),
    endDate: new Date("2025-11-19"),
    color: "text-pink-600",
    bgColor: "bg-pink-400",
    category: "Tranche",
  },
  {
    id: "a27",
    activity: "Clôture C4",
    startDate: new Date("2025-11-25"),
    endDate: new Date("2025-11-25"),
    color: "text-red-600",
    bgColor: "bg-red-400",
    category: "Clôture",
  },
  {
    id: "a28",
    activity: "Clôture C5",
    startDate: new Date("2025-11-27"),
    endDate: new Date("2025-11-27"),
    color: "text-red-600",
    bgColor: "bg-red-400",
    category: "Clôture",
  },
];

const Main2 = () => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Deuxième Diagramme de Gantt - Activités détaillées */}
      <Card className="border-slate-200 shadow-xl mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            Chronogramme des Activités - Septembre à Novembre 2025
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Timeline Header - Mois pour activités */}
          <div className="mb-4 border-b pb-3">
            {/* Ligne des mois */}
            <div className="flex mb-2">
              <div className="w-52 flex-shrink-0"></div>
              <div className="flex-1 flex">
                <div className="flex-1 text-center text-sm font-bold text-gray-800 border-l px-2">
                  Septembre 2025
                </div>
                <div className="flex-1 text-center text-sm font-bold text-gray-800 border-l px-2">
                  Octobre 2025
                </div>
                <div className="flex-1 text-center text-sm font-bold text-gray-800 border-l px-2">
                  Novembre 2025
                </div>
              </div>
            </div>

            {/* Ligne des dates (semaines) */}
            <div className="flex text-[10px]">
              <div className="w-52 flex-shrink-0 text-gray-500 font-medium">
                Activités
              </div>
              <div className="flex-1 flex">
                {/* Septembre */}
                <div className="flex-1 flex border-l">
                  <div className="flex-1 text-center text-gray-600 border-r border-gray-100">
                    1-7
                  </div>
                  <div className="flex-1 text-center text-gray-600 border-r border-gray-100">
                    8-14
                  </div>
                  <div className="flex-1 text-center text-gray-600 border-r border-gray-100">
                    15-21
                  </div>
                  <div className="flex-1 text-center text-gray-600 border-r border-gray-100">
                    22-28
                  </div>
                  <div className="flex-1 text-center text-gray-600">29-30</div>
                </div>

                {/* Octobre */}
                <div className="flex-1 flex border-l">
                  <div className="flex-1 text-center text-gray-600 border-r border-gray-100">
                    1-7
                  </div>
                  <div className="flex-1 text-center text-gray-600 border-r border-gray-100">
                    8-14
                  </div>
                  <div className="flex-1 text-center text-gray-600 border-r border-gray-100">
                    15-21
                  </div>
                  <div className="flex-1 text-center text-gray-600 border-r border-gray-100">
                    22-28
                  </div>
                  <div className="flex-1 text-center text-gray-600">29-31</div>
                </div>

                {/* Novembre */}
                <div className="flex-1 flex border-l">
                  <div className="flex-1 text-center text-gray-600 border-r border-gray-100">
                    1-7
                  </div>
                  <div className="flex-1 text-center text-gray-600 border-r border-gray-100">
                    8-14
                  </div>
                  <div className="flex-1 text-center text-gray-600 border-r border-gray-100">
                    15-21
                  </div>
                  <div className="flex-1 text-center text-gray-600 border-r border-gray-100">
                    22-28
                  </div>
                  <div className="flex-1 text-center text-gray-600">29-30</div>
                </div>
              </div>
            </div>
          </div>

          {/* Gantt Bars pour Activités */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {ACTIVITIES.map((activity) => {
              const minActivityDate = new Date("2025-09-01");
              const maxActivityDate = new Date("2025-11-30");
              const totalActivityDays = Math.ceil(
                (maxActivityDate.getTime() - minActivityDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              );

              const startOffset =
                (activity.startDate.getTime() - minActivityDate.getTime()) /
                (1000 * 60 * 60 * 24);
              const duration =
                (activity.endDate.getTime() - activity.startDate.getTime()) /
                  (1000 * 60 * 60 * 24) +
                1;

              const left = (startOffset / totalActivityDays) * 100;
              const width = Math.max((duration / totalActivityDays) * 100, 1.5);

              return (
                <div key={activity.id} className="group">
                  <div className="flex items-center">
                    <div className="w-52 flex-shrink-0 pr-3">
                      <div
                        className={`text-xs font-medium ${activity.color} truncate`}
                        title={activity.activity}
                      >
                        {activity.activity}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {activity.category}
                      </div>
                    </div>

                    <div className="flex-1 relative h-10">
                      <div className="absolute inset-0 flex">
                        <div className="flex-1 border-l border-gray-100" />
                        <div className="flex-1 border-l border-gray-100" />
                        <div className="flex-1 border-l border-gray-100" />
                      </div>

                      <div
                        className={`absolute top-1.5 h-7 ${activity.bgColor} rounded shadow-md transition-all duration-200 group-hover:shadow-lg group-hover:scale-y-110 cursor-pointer`}
                        style={{ left: `${left}%`, width: `${width}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded" />
                        <div className="relative h-full flex items-center justify-center px-1">
                          <span className="text-[9px] font-bold text-white truncate">
                            {formatDate(activity.startDate)
                              .split(" ")
                              .slice(0, 2)
                              .join(" ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Légende par catégorie */}
          <div className="mt-6 pt-4 border-t">
            <div className="text-sm font-semibold text-gray-700 mb-3">
              Légende par type d'activité
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-indigo-400" />
                <span className="text-xs text-gray-600">Orientation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-400" />
                <span className="text-xs text-gray-600">Transfert CPEC</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-400" />
                <span className="text-xs text-gray-600">Tranches C2</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-purple-400" />
                <span className="text-xs text-gray-600">Tranches C3</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-400" />
                <span className="text-xs text-gray-600">Tranches C4</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-pink-400" />
                <span className="text-xs text-gray-600">Tranches C5</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-400" />
                <span className="text-xs text-gray-600">Admin</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-rose-400" />
                <span className="text-xs text-gray-600">Justificatifs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-violet-400" />
                <span className="text-xs text-gray-600">Comités</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-400" />
                <span className="text-xs text-gray-600">Clôtures</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Main2;
