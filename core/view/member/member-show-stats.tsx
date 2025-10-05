"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import {
  Users,
  Languages,
  Accessibility,
  FolderOpen,
  CheckCircle,
  MapPin,
  Calendar,
  ChevronsUpDown,
  Check,
  BarChart3,
} from "lucide-react";
import { MemberDetail } from "@/core/lib/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { Button } from "@/core/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/core/components/ui/command";
import { cn } from "@/core/lib/utils";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type mDetails = MemberDetail & {
  accompaniment: {
    name: string;
  } | null;
  statut: string;
};

const COLOR_PALETTE = [
  "#0ea5e9",
  "#8b5cf6",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#ec4899",
  "#14b8a6",
  "#06b6d4",
  "#a855f7",
  "#f97316",
  "#22c55e",
  "#f43f5e",
  "#d946ef",
  "#0891b2",
  "#6366f1",
  "#eab308",
  "#16a34a",
  "#dc2626",
  "#c026d3",
  "#0284c7",
  "#818cf8",
  "#facc15",
  "#15803d",
  "#b91c1c",
  "#a21caf",
  "#0369a1",
  "#4f46e5",
  "#fde047",
  "#059669",
  "#991b1b",
  "#86198f",
  "#075985",
  "#3b82f6",
  "#fef08a",
  "#047857",
  "#7f1d1d",
  "#701a75",
  "#0c4a6e",
  "#2563eb",
  "#fef9c3",
  "#065f46",
  "#450a0a",
  "#581c87",
  "#082f49",
  "#1d4ed8",
  "#fefce8",
  "#064e3b",
  "#1e3a8a",
  "#fef3c7",
];

export function useUniqueAccompanimentCount(
  data: mDetails[] | undefined
): number {
  return useMemo(() => {
    if (!data || !Array.isArray(data)) return 0;

    const uniqueIds = new Set<string>();

    data.forEach((item: mDetails) => {
      if (
        item.accompanimentId &&
        item.accompanimentId !== "null" &&
        item.accompanimentId !== "N/A" &&
        item.accompanimentId.trim() !== ""
      ) {
        uniqueIds.add(item.accompanimentId);
      }
    });

    return uniqueIds.size;
  }, [data]);
}

export const DataAnalytics = ({ typedData }: { typedData: mDetails[] }) => {
  const attestationData = useMemo(() => {
    const attestationCounts: Record<string, number> = {};

    typedData.forEach((item) => {
      const attestation = item.attestation || "N/A";
      attestationCounts[attestation] =
        (attestationCounts[attestation] || 0) + 1;
    });

    return {
      labels: Object.keys(attestationCounts),
      series: Object.values(attestationCounts),
    };
  }, []);

  const disabilityData = useMemo(() => {
    let pasDeHandicap = 0;
    let avecHandicap = 0;

    typedData.forEach((item) => {
      if (item.disability === "Pas de Handicap") {
        pasDeHandicap++;
      } else {
        avecHandicap++;
      }
    });

    const total = pasDeHandicap + avecHandicap;
    const pasDeHandicapPercent = total > 0 ? (pasDeHandicap / total) * 100 : 0;
    const avecHandicapPercent = total > 0 ? (avecHandicap / total) * 100 : 0;

    return {
      categories: ["Sans Handicap", "Avec Handicap"],
      series: [pasDeHandicapPercent, avecHandicapPercent],
      counts: [pasDeHandicap, avecHandicap],
    };
  }, []);

  // Disability Chart Options (Bar Chart with Percentages)
  const disabilityChartOptions: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "inherit",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 8,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      formatter: (val: number) => `${val.toFixed(1)}%`,
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        colors: ["#304758"],
      },
    },
    xaxis: {
      categories: disabilityData.categories,
      labels: {
        style: {
          fontSize: "14px",
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      title: {
        text: "Pourcentage (%)",
        style: {
          fontSize: "14px",
          fontWeight: 600,
        },
      },
      labels: {
        formatter: (val: number) => `${val.toFixed(0)}%`,
      },
      max: 100,
    },
    tooltip: {
      y: {
        formatter: (val: number, opts: any) => {
          const count = disabilityData.counts[opts.dataPointIndex];
          return `${val.toFixed(1)}% (${count} personnes)`;
        },
      },
    },
    colors: ["#10b981", "#ef4444"],
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: ["#34d399", "#f87171"],
        opacityFrom: 0.85,
        opacityTo: 0.85,
      },
    },
  };

  // Attestation Bar Chart Options
  const attestationBarChartOptions: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "inherit",
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 8,
        distributed: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: 30,
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: ["#fff"],
      },
    },
    xaxis: {
      categories: attestationData.labels,
      title: {
        text: "Nombre de bénéficiaires",
        style: {
          fontSize: "14px",
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    colors: COLOR_PALETTE,
    fill: {
      type: "solid",
      opacity: 0.9,
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: "#e5e7eb",
    },
  };

  const disabilityChartSeries = [
    {
      name: "Pourcentage",
      data: disabilityData.series,
    },
  ];

  const [selectedProject, setSelectedProject] =
    useState<string>("Tous les projets");

  const [open, setOpen] = useState(false);

  const filteredData = useMemo(() => {
    if (selectedProject === "Tous les projets") {
      return typedData;
    }
    return typedData.filter((item) => item.project.name === selectedProject);
  }, [typedData, selectedProject]);

  const uniqueProjects = useMemo(() => {
    const projects = [...new Set(typedData.map((item) => item.project.name))];
    return ["Tous les projets", ...projects];
  }, [typedData]);

  const languageStats = useMemo(() => {
    const counts = {
      somali: 0,
      afar: 0,
      arabe: 0,

      combinaisons: 0,
      detailsCombinaisons: {} as Record<string, number>,
    };

    filteredData.forEach((entry) => {
      const lang = entry.language.toLowerCase();

      if (lang === "n/a") {
        return;
      }

      const languages = lang.split(/,\s*/);

      if (languages.length === 1) {
        if (lang.includes("somali")) counts.somali++;
        else if (lang.includes("afar")) counts.afar++;
        else if (lang.includes("arabe")) counts.arabe++;
      } else {
        counts.combinaisons++;
        const key = languages.sort().join(", ");
        counts.detailsCombinaisons[key] =
          (counts.detailsCombinaisons[key] || 0) + 1;
      }
    });

    return {
      ...counts,
      total: filteredData.length,
    };
  }, [filteredData]);

  const languageTotals = {
    Somali: languageStats.somali,
    Afar: languageStats.afar,
    Arabe: languageStats.arabe,

    Combinaisons: languageStats.combinaisons,
  };

  const calculateAge = (dob: Date) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const getAgeRange = (age: number) => {
    if (age < 18) return "Moins de 18 ans";
    if (age >= 18 && age <= 25) return "18-25 ans";
    if (age >= 26 && age <= 35) return "26-35 ans";
    if (age >= 36 && age <= 45) return "36-45 ans";
    if (age >= 46 && age <= 55) return "46-55 ans";
    return "Plus de 55 ans";
  };

  const disabilityTotals = filteredData.reduce((acc, item) => {
    if (
      item.disability.toLowerCase() !== "pas de handicap" &&
      item.disability.toLowerCase() !== "autre"
    ) {
      acc[item.disability] = (acc[item.disability] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const projectTotals = filteredData.reduce((acc, item) => {
    acc[item.project.name] = (acc[item.project.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusTotals = filteredData.reduce((acc, item) => {
    let statusLabel = item.statut;
    if (statusLabel.toLowerCase() === "non") {
      statusLabel = "pas abandonnée";
    } else if (statusLabel.toLowerCase() === "oui") {
      statusLabel = "abandonnée";
    }
    acc[statusLabel] = (acc[statusLabel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const communeTotals = filteredData.reduce((acc, item) => {
    if (item.commune === "N/A") {
      return acc;
    }
    acc[item.commune] = (acc[item.commune] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const ageRangeTotals = filteredData.reduce((acc, item) => {
    const age = calculateAge(item.dob);
    const ageRange = getAgeRange(age);
    acc[ageRange] = (acc[ageRange] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const createDonutChart = (
    data: Record<string, number>,
    colors: string[]
  ) => ({
    series: Object.values(data),
    options: {
      chart: {
        type: "donut" as const,
        height: 350,
      },
      labels: Object.keys(data),
      colors: colors,
      legend: {
        position: "bottom" as const,
      },
      plotOptions: {
        pie: {
          donut: {
            size: "65%",
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => Math.round(val) + "%",
      },
      tooltip: {
        y: {
          formatter: (val: number) => val + " participants",
        },
      },
    },
  });

  const createBarChart = (data: Record<string, number>, color: string) => ({
    series: [
      {
        name: "Participants",
        data: Object.values(data),
      },
    ],
    options: {
      chart: {
        type: "bar" as const,
        height: 350,
      },
      xaxis: {
        categories: Object.keys(data),
      },
      colors: [color],
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
      tooltip: {
        y: {
          formatter: (val: number) => val + " participants",
        },
      },
    },
  });

  const createVerticalBarChart = (
    data: Record<string, number>,
    color: string
  ) => ({
    series: [
      {
        name: "Participants",
        data: Object.values(data),
      },
    ],
    options: {
      chart: {
        type: "bar" as const,
        height: 350,
      },
      xaxis: {
        categories: Object.keys(data),
        labels: {
          rotate: -45,
        },
      },
      colors: [color],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
        },
      },
      dataLabels: {
        enabled: true,
      },
      tooltip: {
        y: {
          formatter: (val: number) => val + " participants",
        },
      },
    },
  });

  const createPieChart = (data: Record<string, number>, colors: string[]) => ({
    series: Object.values(data),
    options: {
      chart: {
        type: "pie" as const,
        height: 300,
      },
      labels: Object.keys(data),
      colors: colors,
      legend: {
        position: "bottom" as const,
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => Math.round(val) + "%",
      },
      tooltip: {
        y: {
          formatter: (val: number) => val + " participants",
        },
      },
    },
  });

  const createRadialBarChart = (
    data: Record<string, number>,
    colors: string[]
  ) => ({
    series: Object.values(data),
    options: {
      chart: {
        type: "radialBar" as const,
        height: 300,
      },
      labels: Object.keys(data),
      colors: colors,
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "12px",
            },
            value: {
              fontSize: "14px",
              formatter: (val: number) => Math.round(val) + "%",
            },
            total: {
              show: true,
              label: "Total",
              formatter: () =>
                Object.values(data)
                  .reduce((a, b) => a + b, 0)
                  .toString(),
            },
          },
        },
      },
      legend: {
        show: true,
        position: "bottom" as const,
      },
    },
  });

  const createAreaChart = (data: Record<string, number>, color: string) => ({
    series: [
      {
        name: "Participants",
        data: Object.values(data),
      },
    ],
    options: {
      chart: {
        type: "area" as const,
        height: 300,
        sparkline: {
          enabled: false,
        },
      },
      xaxis: {
        categories: Object.keys(data),
        labels: {
          style: {
            fontSize: "10px",
          },
        },
      },
      colors: [color],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth" as const,
        width: 2,
      },
      tooltip: {
        y: {
          formatter: (val: number) => val + " participants",
        },
      },
    },
  });

  const createLineChart = (data: Record<string, number>, color: string) => ({
    series: [
      {
        name: "Participants",
        data: Object.values(data),
      },
    ],
    options: {
      chart: {
        type: "line" as const,
        height: 350,
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: Object.keys(data),
        labels: {
          rotate: -45,
          style: {
            fontSize: "11px",
          },
        },
      },
      colors: [color],
      stroke: {
        curve: "smooth" as const,
        width: 3,
      },
      markers: {
        size: 6,
        colors: [color],
        strokeColors: "#fff",
        strokeWidth: 2,
      },
      dataLabels: {
        enabled: true,
        background: {
          enabled: true,
          foreColor: "#fff",
          borderRadius: 2,
          padding: 4,
          opacity: 0.9,
        },
      },
      tooltip: {
        y: {
          formatter: (val: number) => {
            const percentage = ((val / filteredData.length) * 100).toFixed(1);
            return `${val} participants (${percentage}%)`;
          },
        },
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
    },
  });

  const createTreemapChart = (
    data: Record<string, number>,
    colors: string[]
  ) => ({
    series: [
      {
        data: Object.entries(data).map(([key, value], index) => ({
          x: key,
          y: value,
          fillColor: colors[index % colors.length],
        })),
      },
    ],
    options: {
      chart: {
        type: "treemap" as const,
        height: 350,
      },
      colors: colors,
      plotOptions: {
        treemap: {
          enableShades: true,
          shadeIntensity: 0.5,
          reverseNegativeShade: true,
          colorScale: {
            ranges: [
              {
                from: -6,
                to: 0,
                color: "#CD363A",
              },
              {
                from: 0.001,
                to: 6,
                color: "#52B12C",
              },
            ],
          },
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: "12px",
          fontWeight: "bold",
          colors: ["#fff"],
        },
        formatter: (text: string, op: any) => {
          const percentage = ((op.value / filteredData.length) * 100).toFixed(
            1
          );
          return [text, `${op.value} (${percentage}%)`];
        },
      },
      tooltip: {
        y: {
          formatter: (val: number) => {
            const percentage = ((val / filteredData.length) * 100).toFixed(1);
            return `${val} participants (${percentage}%)`;
          },
        },
      },
    },
  });

  const createRadarChart = (
    data: Record<string, number>,
    colors: string[]
  ) => ({
    series: [
      {
        name: "Participants",
        data: Object.values(data),
      },
    ],
    options: {
      chart: {
        type: "radar" as const,
        height: 350,
      },
      xaxis: {
        categories: Object.keys(data),
      },
      colors: colors,
      fill: {
        opacity: 0.3,
      },
      stroke: {
        show: true,
        width: 2,
        colors: colors,
        dashArray: 0,
      },
      markers: {
        size: 4,
        colors: colors,
        strokeColors: "#fff",
        strokeWidth: 2,
      },
      tooltip: {
        y: {
          formatter: (val: number) => val + " participants",
        },
      },
      yaxis: {
        tickAmount: 7,
      },
    },
  });

  const languageChart = createVerticalBarChart(languageTotals, "#10B981");
  const ageChart = createDonutChart(ageRangeTotals, [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
  ]);
  const disabilityChart = createVerticalBarChart(disabilityTotals, "#F97316");
  const statusChart = createTreemapChart(statusTotals, ["#10B981", "#EF4444"]);
  const projectChart = createLineChart(projectTotals, "#3B82F6");
  const communeChart = createPieChart(communeTotals, [
    "#8B5CF6",
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#06B6D4",
  ]);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 flex  justify-center items-center">
          <CardContent className="p-6 w-5/6  ">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FolderOpen className="h-5 w-5 text-blue-600" />
                </div>
                <label className="text-lg font-semibold text-gray-800">
                  Filtrer par projet
                </label>
              </div>
              <div className="relative flex-1 max-w-md">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between px-4 py-3 bg-white border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 text-gray-700 font-medium shadow-sm hover:shadow-md h-auto"
                    >
                      {selectedProject}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Rechercher un projet..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>Aucun projet trouvé.</CommandEmpty>
                        <CommandGroup>
                          {uniqueProjects.map((project) => (
                            <CommandItem
                              key={project}
                              value={project}
                              onSelect={(currentValue) => {
                                setSelectedProject(
                                  currentValue === selectedProject
                                    ? "Tous les projets"
                                    : currentValue
                                );
                                setOpen(false);
                              }}
                              className="cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedProject === project
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {project}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              {selectedProject !== "Tous les projets" && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 rounded-lg">
                  <span className="text-sm text-blue-700 font-medium">
                    Projet sélectionné:
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-blue-200 text-blue-800 font-semibold"
                  >
                    {selectedProject}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Bénéficiaires
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {filteredData.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Langues Différentes
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {
                    Object.keys(languageTotals).filter(
                      (lang) => lang !== "Autres" && lang !== "Combinaisons"
                    ).length
                  }
                </p>
              </div>
              <Languages className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Communes Couvertes
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {Object.keys(communeTotals).length}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total de Cohorte
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {Object.keys(projectTotals).length}
                </p>
              </div>
              <FolderOpen className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total AGR</p>
                <p className="text-3xl font-bold text-indigo-600">541</p>
              </div>
              <FolderOpen className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-green-600" />
              Total par Langue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={languageChart.options}
              series={languageChart.series}
              type="bar"
              height={350}
            />
            {languageStats.combinaisons > 0 && (
              <div className="mt-4 pt-3 border-t">
                <h4 className="text-sm font-semibold mb-2">
                  Détails des combinaisons:
                </h4>
                <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100 hover:scrollbar-thumb-blue-600 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                  {Object.entries(languageStats.detailsCombinaisons).map(
                    ([combo, count]) => (
                      <div
                        key={combo}
                        className="flex justify-between items-center text-xs"
                      >
                        <span className="text-gray-600">{combo}</span>
                        <Badge variant="outline" className="text-xs">
                          {count}
                        </Badge>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              Total par Tranche d'Âge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={ageChart.options}
              series={ageChart.series}
              type="donut"
              height={350}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <BarChart3 className="h-6 w-6 text-green-600" />
            Situation de Handicap
          </CardTitle>
          <p className="text-sm text-slate-600">
            Comparaison des bénéficiaires
          </p>
        </CardHeader>
        <CardContent>
          <Chart
            options={disabilityChartOptions}
            series={disabilityChartSeries}
            type="bar"
            height={400}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Accessibility className="h-5 w-5 text-orange-600" />
            Total par Type de Handicap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            options={disabilityChart.options}
            series={disabilityChart.series}
            type="bar"
            height={350}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-blue-600" />
              Total par Projet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={projectChart.options}
              series={projectChart.series}
              type="line"
              height={300}
            />
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-red-600" />
              Total par Statut
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={statusChart.options}
              series={statusChart.series}
              type="treemap"
              height={300}
            />
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              Total par Commune
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={communeChart.options}
              series={communeChart.series}
              type="pie"
              height={300}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
