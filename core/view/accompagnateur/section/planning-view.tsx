import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { Calendar, Clock, MapPin, Target, CheckCircle } from "lucide-react";

import { useMyData } from "@/core/hooks/store";

export function PlanningView() {
  const { data: user } = useMyData();

  if (!user) {
    return <div>Chargement...</div>;
  }

  const allVisits = user.plannings.flatMap((planning: any) => planning.visit);
  const completedVisits = allVisits.filter((visit: any) => visit.status);
  const pendingVisits = allVisits.filter((visit: any) => !visit.status);

  return (
    <section className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Les calendriers des visites
        </h2>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Visites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {allVisits.length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Complétées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedVisits.length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              En Attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingVisits.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visits Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Calendrier des Visites</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allVisits
              .sort(
                (a: any, b: any) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((visit: any) => (
                <div
                  key={visit.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {visit.status ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <Clock className="h-6 w-6 text-orange-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        {visit.objetif}
                      </h4>
                      <Badge
                        variant={visit.status ? "default" : "secondary"}
                        className={
                          visit.status
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }
                      >
                        {visit.status ? "Complétée" : "En attente"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(visit.date).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {visit.startTime} - {visit.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{visit.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="p-4 h-auto flex flex-col items-center gap-2 bg-transparent"
            >
              <Calendar className="h-6 w-6 text-emerald-600" />
              <span>Planifier Visite</span>
            </Button>
            <Button
              variant="outline"
              className="p-4 h-auto flex flex-col items-center gap-2 bg-transparent"
            >
              <Target className="h-6 w-6 text-blue-600" />
              <span>Définir Objectifs</span>
            </Button>
            <Button
              variant="outline"
              className="p-4 h-auto flex flex-col items-center gap-2 bg-transparent"
            >
              <MapPin className="h-6 w-6 text-purple-600" />
              <span>Gérer Lieux</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
