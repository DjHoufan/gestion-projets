"use client";

import { Calendar, CheckCircle, Clock, Loader, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/core/components/ui/card";
import type { ProjectDetail } from "@/core/lib/types";

import { Spinner } from "@/core/components/ui/spinner";

interface StatsCardsProps {
  projects: ProjectDetail[];
  isPending: boolean;
}

export function StatsCards({ projects, isPending }: StatsCardsProps) {
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => {
    const now = new Date();
    const start = new Date(p.startDate);
    const end = new Date(p.endDate);
    return now >= start && now <= end;
  }).length;

  const completedProjects = projects.filter((p) => {
    const now = new Date();
    const end = new Date(p.endDate);
    return now > end;
  }).length;

  const upcomingProjects = projects.filter((p) => {
    const now = new Date();
    const start = new Date(p.startDate);
    return now < start;
  }).length;

  const stats = [
    {
      title: "Total des projets",
      value: totalProjects,
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-600",
      bgColor: "bg-emerald-500",
    },
    {
      title: "Projets actifs",
      value: activeProjects,
      icon: Clock,
      color: "bg-emerald-50 text-emerald-600",
      bgColor: "bg-orange-500", // Orange for active
    },
    {
      title: "Projets terminés",
      value: completedProjects,
      icon: CheckCircle,
      color: "bg-emerald-50 text-emerald-600",
      bgColor: "bg-emerald-700",
    },
    {
      title: "Projets à venir",
      value: upcomingProjects,
      icon: Calendar,
      color: "bg-emerald-50 text-emerald-600",
      bgColor: "bg-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="border-emerald-100 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-emerald-900">
                  {isPending ? (
                    <Spinner size={40} variant="ring" />
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl ${stat.bgColor} text-white shadow-lg`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
