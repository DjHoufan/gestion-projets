"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { Activity, BarChart3, PieChart } from "lucide-react";

// Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Spinner } from "@/core/components/ui/spinner";

// Dynamic imports
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface MonthlyActivity {
  month: string; // ex: "janv.", "févr.", etc.
  visits: number;
  meetings: number;
  conflicts: number;
}

// Types
interface ChartData {
  name: string;
  value: number;
}

interface MonthlyProgress {
  month: string;
  active: number;
  completed: number;
}

interface WeeklyActivity {
  day: string;
  visits: number;
  meetings: number;
  conflicts: number;
}

interface StatsData {
  users: {
    byGender: ChartData[];
  };
  projects: {
    monthlyProgress: MonthlyProgress[];
  };
  activities: {
    monthlyActivity: MonthlyActivity[];
  };
}

// Constants
const CHART_COLORS = {
  primary: "#4f46e5",
  secondary: "#ec4899",
  purple: "#8b5cf6",
  green: "#4ade80",
  yellow: "#fbbf24",
  red: "#ef4444",
} as const;

const CHART_HEIGHT = 300;

type Props = {
  statsData: any;
  isPending: boolean;
};

export const MainDashboard = ({ statsData, isPending }: Props) => {
 

  // Base options pour donut
  const baseDonutOptions = useMemo(
    () => ({
      chart: {
        type: "donut" as const,
        height: CHART_HEIGHT,
        fontFamily: "inherit",
      },
      colors: [CHART_COLORS.primary, CHART_COLORS.secondary],
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
        formatter: (val: number) => `${Math.round(val)}%`,
        style: {
          fontSize: "14px",
          fontWeight: "600",
        },
      },
    }),
    []
  );

  // Donut par genre
  const genderChartOptions = useMemo(
    () => ({
      ...baseDonutOptions,
      labels:
        statsData?.users?.byGender?.map((item: ChartData) => item.name) ?? [],
    }),
    [baseDonutOptions, statsData]
  );

  // Area progression projets
  const projectProgressOptions = useMemo(
    () => ({
      chart: {
        type: "area" as const,
        height: CHART_HEIGHT,
        toolbar: { show: false },
        fontFamily: "inherit",
      },
      xaxis: {
        categories:
          statsData?.projects?.monthlyProgress?.map(
            (item: MonthlyProgress) => item.month
          ) ?? [],
      },
      colors: [CHART_COLORS.purple, CHART_COLORS.green],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.8,
          opacityTo: 0.2,
        },
      },
      stroke: {
        curve: "smooth" as const,
        width: 3,
      },
      dataLabels: { enabled: false },
      grid: { borderColor: "#e5e7eb" },
    }),
    [statsData]
  );

  const projectSeries = useMemo(() => {
    if (!statsData?.projects?.monthlyProgress) return [];
    return [
      {
        name: "Projets Terminés",
        data: statsData.projects.monthlyProgress.map(
          (item: MonthlyProgress) => item.completed
        ),
      },
      {
        name: "Projets en cours",
        data: statsData.projects.monthlyProgress.map(
          (item: MonthlyProgress) => item.active
        ),
      },
    ];
  }, [statsData]);

  const monthlyActivityOptions = useMemo(
    () => ({
      chart: {
        type: "bar" as const,
        height: CHART_HEIGHT,
        toolbar: { show: false },
        fontFamily: "inherit",
      },
      xaxis: {
        categories:
          statsData?.activities?.monthlyActivity?.map(
            (item: MonthlyActivity) => item.month
          ) ?? [],
      },
      colors: [CHART_COLORS.green, CHART_COLORS.yellow, CHART_COLORS.red],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "60%",
          borderRadius: 6,
        },
      },
      dataLabels: { enabled: false },
      legend: { position: "top" as const },
      grid: { borderColor: "#e5e7eb" },
    }),
    [statsData]
  );

  const monthlyActivitySeries = useMemo(() => {
    if (!statsData?.activities?.monthlyActivity) return [];
    return [
      {
        name: "Visites",
        data: statsData.activities.monthlyActivity.map(
          (item: MonthlyActivity) => item.visits
        ),
      },
      {
        name: "Rencontres",
        data: statsData.activities.monthlyActivity.map(
          (item: MonthlyActivity) => item.meetings
        ),
      },
      {
        name: "Conflits",
        data: statsData.activities.monthlyActivity.map(
          (item: MonthlyActivity) => item.conflicts
        ),
      },
    ];
  }, [statsData]);

  // Wrapper pour loader
  const ChartWrapper = ({
    children,
    isLoading,
  }: {
    children: React.ReactNode;
    isLoading: boolean;
  }) => {
    if (isLoading || !statsData) {
      return (
        <div className="w-full flex justify-center items-center">
          <Spinner variant="bars" size={50} className="text-primary" />
        </div>
      );
    }
    return <>{children}</>;
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Genre */}
        <Card className="border-border  backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-chart-2/10">
                <PieChart className="h-5 w-5 text-chart-2" />
              </div>
              Répartition par Genre
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Distribution des bénéficiaires par genre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartWrapper isLoading={isPending}>
              <Chart
                options={genderChartOptions}
                series={
                  statsData?.users?.byGender?.map(
                    (item: ChartData) => item.value
                  ) ?? []
                }
                type="donut"
                height={CHART_HEIGHT}
              />
            </ChartWrapper>
          </CardContent>
        </Card>

        {/* Projets */}
        <Card className="border-border  backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-secondary/10">
                <BarChart3 className="h-5 w-5 text-secondary" />
              </div>
              Progression des Projets
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Évolution mensuelle des projets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartWrapper isLoading={isPending}>
              <Chart
                options={projectProgressOptions}
                series={projectSeries}
                type="area"
                height={CHART_HEIGHT}
              />
            </ChartWrapper>
          </CardContent>
        </Card>
      </div>

      {/* Activités */}
      <Card className="border-border  backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-chart-3/10">
              <Activity className="h-5 w-5 text-chart-3" />
            </div>
            Activités Hebdomadaires
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Répartition des activités par jour de la semaine
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartWrapper isLoading={isPending}>
            <Chart
              options={monthlyActivityOptions}
              series={monthlyActivitySeries}
              type="bar"
              height={CHART_HEIGHT}
            />
          </ChartWrapper>
        </CardContent>
      </Card>
    </div>
  );
};
