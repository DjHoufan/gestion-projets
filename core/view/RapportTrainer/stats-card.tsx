"use client";

import { Card, CardContent } from "@/core/components/ui/card";
import { Spinner } from "@/core/components/ui/spinner";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import React from "react";

// Définition des types possibles
type Trend = "up" | "down" | "stable";
type ColorKey = "blue" | "emerald" | "purple" | "orange";

export interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: ColorKey;
  trend: Trend;
  isPending: boolean;
}

export default function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  color,
  trend,
  isPending,
}: StatsCardProps) {
  const colorClasses: Record<ColorKey, string> = {
    blue: "from-blue-500 to-blue-600",
    emerald: "from-emerald-500 to-emerald-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  };

  const trendIcon: Record<
    Trend,
    React.ComponentType<{ className?: string }>
  > = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Minus,
  };

  const trendColor: Record<Trend, string> = {
    up: "text-emerald-600",
    down: "text-red-600",
    stable: "text-gray-600",
  };

  const TrendIcon = trendIcon[trend];

  return (
    <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm hover:scale-105 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {isPending ? <Spinner variant="ring" className="text-primary" /> : value}
            </p>
            <div className="flex items-center gap-1">
              <TrendIcon className={`w-4 h-4 ${trendColor[trend]}`} />
              <p className={`text-sm font-medium ${trendColor[trend]}`}>
                {change}
              </p>
            </div>
          </div>
          <div
            className={`w-16 h-16 bg-gradient-to-br ${colorClasses[color]} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
