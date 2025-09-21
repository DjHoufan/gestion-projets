import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  Plus,
  TrendingUp,
  Activity,
} from "lucide-react";

import { useMyData } from "@/core/hooks/store";

export function PlanningView() {
  const { data: user } = useMyData();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Chargement de vos données...</p>
        </div>
      </div>
    );
  }

  const allVisits = user.plannings.flatMap((planning: any) => planning.visit);
  const completedVisits = allVisits.filter((visit: any) => visit.status);
  const pendingVisits = allVisits.filter((visit: any) => !visit.status);
  const upcomingVisits = allVisits.filter(
    (visit: any) => !visit.status && new Date(visit.date) > new Date()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      <div className="container mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border border-violet-200/50 bg-gradient-to-r from-violet-50 to-purple-50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-black text-violet-700 mb-1">
                    {allVisits.length}
                  </p>
                  <p className="text-sm font-medium text-violet-600 uppercase tracking-wide">
                    Total Visites
                  </p>
                </div>
                <div className="w-12 h-12 bg-violet-500 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-emerald-200/50 bg-gradient-to-r from-emerald-50 to-green-50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-black text-emerald-700 mb-1">
                    {completedVisits.length}
                  </p>
                  <p className="text-sm font-medium text-emerald-600 uppercase tracking-wide">
                    Complétées
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-amber-200/50 bg-gradient-to-r from-amber-50 to-orange-50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-black text-amber-700 mb-1">
                    {pendingVisits.length}
                  </p>
                  <p className="text-sm font-medium text-amber-600 uppercase tracking-wide">
                    En Attente
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-blue-200/50 bg-gradient-to-r from-blue-50 to-cyan-50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-black text-blue-700 mb-1">
                    {upcomingVisits.length}
                  </p>
                  <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                    À Venir
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="border-0  bg-card/50 backdrop-blur-sm">
            <CardContent className="space-y-4">
              {allVisits
                .sort(
                  (a: any, b: any) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((visit: any) => (
                  <div
                    key={visit.id}
                    className="group p-6 border border-border/50 rounded-2xl hover:bg-muted/30 hover:border-primary/20 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {visit.status ? (
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <Clock className="w-5 h-5 text-orange-600" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                            {visit.objetif}
                          </h4>
                          <Badge
                            variant={visit.status ? "default" : "secondary"}
                            className={`${
                              visit.status
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                            } border-0 px-3 py-1`}
                          >
                            {visit.status ? "Complétée" : "En attente"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <span className="font-medium">
                              {new Date(visit.date).toLocaleDateString(
                                "fr-FR",
                                {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                              <Clock className="w-4 h-4" />
                            </div>
                            <span className="font-medium">
                              {visit.startTime} - {visit.endTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <span className="font-medium">
                              {visit.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

         
        </div>
      </div>
    </div>
  );
}
