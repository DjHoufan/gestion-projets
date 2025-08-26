"use client";

import { Card, CardContent } from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Spinner } from "@/core/components/ui/spinner";
import {
  TrendingUp,
  TrendingDown,
  FolderOpen,
  Users,
  Target,
  CalendarClock,
} from "lucide-react";
import { useGetDashboardStats } from "@/core/hooks/use-stats";

const primaryMetrics = [
  {
    title: "Projets Actifs",
    match: "Project",
    icon: FolderOpen,
    color: "teal",
  },
  {
    title: "Bénéficiaires",
    match: "Member",
    icon: Users,
    color: "blue",
  },
  {
    title: "Accompagnements",
    match: "Accompaniment",
    icon: Target,
    color: "green",
  },
  {
    title: "Visites",
    match: "Visits",
    icon: CalendarClock,
    color: "orange",
  },
] as const;

const colorClasses = {
  teal: { icon: "bg-teal-500", text: "text-teal-700" },
  blue: { icon: "bg-blue-500", text: "text-blue-700" },
  green: { icon: "bg-green-500", text: "text-green-700" },
  orange: { icon: "bg-orange-500", text: "text-orange-700" },
};

export function MetricsGrid() {
  const { data, isPending } = useGetDashboardStats();

  const mergedMetrics = primaryMetrics.map((metric) => {
    const apiMetric = data?.find((item) => item.title === metric.match);
    const delta = apiMetric?.change ?? "";

    return {
      ...metric,
      value: apiMetric?.value ?? "–",
      change: delta,
      changeType: delta.startsWith("-") ? "decrease" : "increase",
    };
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {mergedMetrics.map((metric) => {
        const colors = colorClasses[metric.color];
        return (
          <Card
            key={metric.title}
            className="border-0 shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${colors.icon} text-white`}>
                  <metric.icon className="h-5 w-5" />
                </div>
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 text-xs"
                >
                  {metric.changeType === "increase" ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  {metric.change}
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {isPending ? (
                      <Spinner className="text-primary" variant="bars" />
                    ) : (
                      metric.value
                    )}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {metric.title}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
