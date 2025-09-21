"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Calendar, MapPin, AlertTriangle, Users } from "lucide-react";

import { Spinner } from "@/core/components/ui/spinner";
import { GlobalActivitiesData } from "@/core/lib/queries_stats";

const statusLabels: Record<string, string> = {
  completed: "Terminé",
  scheduled: "Planifié",
  resolved: "Résolu",
  pending: "En attente",
};

const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-800",
  scheduled: "bg-blue-100 text-blue-800",
  resolved: "bg-purple-100 text-purple-800",
  pending: "bg-gray-100 text-gray-800",
};

const activityIcons: Record<string, any> = {
  Visite: MapPin,
  Rencontre: Users,
  Conflit: AlertTriangle,
  default: Calendar,
};

const StatCard = ({
  value,
  label,
  color,
}: {
  value?: number;
  label: string;
  color: string;
}) => (
  <div className={`text-center p-3 rounded-lg ${color}`}>
    <div className="text-2xl font-bold">
      {value !== undefined ? (
        value
      ) : (
        <Spinner variant="bars" className="mx-auto" />
      )}
    </div>
    <div className="text-sm">{label}</div>
  </div>
);

type Props = {
  data: GlobalActivitiesData;
  isLoading: boolean;
};

export function ActivityStats({ data, isLoading }: Props) {
  // const { data, isLoading } = useGetActivities();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activités Récentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Résumé global */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            value={data?.activities.visits}
            label="Visites Terrain"
            color="bg-blue-50 text-blue-600"
          />
          <StatCard
            value={data?.activities.meetings}
            label="Rencontres"
            color="bg-green-50 text-green-600"
          />
          <StatCard
            value={data?.activities.conflicts}
            label="Conflits"
            color="bg-red-50 text-red-600"
          />
          <StatCard
            value={data?.activities.signatures}
            label="Signatures"
            color="bg-purple-50 text-purple-600"
          />
        </div>

        {/* Activités récentes */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Activités Récentes</h4>
          {isLoading ? (
            <div className="flex justify-center">
              <Spinner variant="bars" />
            </div>
          ) : (
            data?.recentActivities.map((a, i) => {
              const Icon = activityIcons[a.type] || activityIcons.default;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{a.type}</div>
                      <div className="text-sm text-muted-foreground">
                        {a.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={statusColors[a.status]}>
                      {statusLabels[a.status]}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {a.date ? new Date(a.date).toLocaleDateString("fr-FR") : ''}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
