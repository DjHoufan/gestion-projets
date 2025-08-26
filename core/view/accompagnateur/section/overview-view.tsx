import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Button } from "@/core/components/ui/button";
import {
  Users,
  Calendar,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  Package,
  FileText,
  Target,
  Activity,
  Plus,
} from "lucide-react";
import type { ViewProps, Statistics, RecentPurchase } from "@/core/lib/types";
import { JSX } from "react";
import { Visits } from "@prisma/client";

export function OverviewView({ user }: ViewProps): JSX.Element {
  // Calculate statistics
  const statistics: Statistics = {
    totalMembers: user.accompaniments.reduce(
      (acc: number, acc_item) => acc + acc_item.members.length,
      0
    ),
    totalPurchases: user.accompaniments.reduce(
      (acc: number, acc_item) => acc + acc_item.purchases.length,
      0
    ),

    totalSpent: user.accompaniments.reduce(
      (acc: number, acc_item) =>
        acc + acc_item.purchases.reduce((sum: number, p) => sum + p.total, 0),
      0
    ),
    totalVisits: user.plannings.reduce(
      (acc: number, planning) => acc + planning.visit.length,
      0
    ),
    completedVisits: user.plannings.reduce(
      (acc: number, planning) =>
        acc + planning.visit.filter((visit: Visits) => visit.status).length,
      0
    ),
    budgetUsagePercentage: 0,
  };

  // Get recent purchases
  const recentPurchases: RecentPurchase[] = user.accompaniments.flatMap(
  (acc) =>
    acc.purchases.map((purchase) => ({
      ...purchase,  // This should include all required RecentPurchase properties
      accompanimentName: acc.name || "",  // Assuming accompaniment has a 'name' property
    })) || []
);

  return (
    <section className="space-y-8 p-6">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 rounded-2xl"></div>
        <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
        <div className="relative p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-white/30 shadow-lg">
                  <AvatarImage
                    src={user.profile || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-white/20 text-white text-2xl backdrop-blur">
                    {user.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-green-400 rounded-full p-1">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Bonjour, {user.name}
                </h1>
                <p className="text-emerald-100 text-lg">
                  Accompagnateur • {user.address}
                </p>
                <p className="text-emerald-200 text-sm">
                  Membre depuis{" "}
                  {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                <p className="text-emerald-100 text-sm">Dernière connexion</p>
                <p className="text-white font-semibold">
                  {new Date(user.updatedAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats in Header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/15 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">
                {user.accompaniments.length}
              </div>
              <div className="text-emerald-100 text-sm">Accompagnements</div>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">
                {statistics.totalMembers}
              </div>
              <div className="text-emerald-100 text-sm">Membres</div>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">
                {statistics.completedVisits}/{statistics.totalVisits}
              </div>
              <div className="text-emerald-100 text-sm">Visites</div>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{user.conflit.length}</div>
              <div className="text-emerald-100 text-sm">Conflits</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Accompaniments Card */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-1 border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <Users className="h-5 w-5" />
              Total Accompagnements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-emerald-600">
                  {user.accompaniments.length}
                </p>
                <p className="text-sm text-gray-600">Accompagnements actifs</p>
              </div>
              <div className="p-4 bg-emerald-100 rounded-full">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
            <div className="space-y-3 pt-2 border-t border-emerald-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Membres totaux</span>
                <span className="font-semibold text-emerald-600">
                  {statistics.totalMembers}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Projets actifs</span>
                <span className="font-semibold text-emerald-600">
                  {
                    new Set(
                      user.accompaniments
                        .map((acc) => acc.project?.id)
                        .filter(Boolean)
                    ).size
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purchases Summary */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <ShoppingCart className="h-5 w-5" />
              Achats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {statistics.totalPurchases}
                </p>
                <p className="text-sm text-gray-600">Transactions</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="pt-2 border-t border-blue-100">
              <p className="text-xs text-gray-500">Montant total dépensé</p>
              <p className="font-semibold text-blue-700">
                {statistics.totalSpent.toLocaleString()} DJF
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Emargements Summary */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <FileText className="h-5 w-5" />
              Émargements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {user.emargements.length}
                </p>
                <p className="text-sm text-gray-600">Documents</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="pt-2 border-t border-purple-100">
              <p className="text-xs text-gray-500">Signés</p>
              <p className="font-semibold text-purple-700">
                {user.emargements.filter((em) => em.signature).length} /{" "}
                {user.emargements.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-600" />
            Activités Récentes
          </h3>

          {/* Recent Visits */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                Dernières Visites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user.plannings[0]?.visit.slice(0, 3).map((visit: Visits) => (
                  <div
                    key={visit.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div
                      className={`p-2 rounded-full ${
                        visit.status ? "bg-green-100" : "bg-orange-100"
                      }`}
                    >
                      {visit.status ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {visit.objetif}
                      </p>
                      <p className="text-xs text-gray-500">{visit.location}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(visit.date).toLocaleDateString("fr-FR")} •{" "}
                        {visit.startTime}
                      </p>
                    </div>
                    <Badge
                      variant={visit.status ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {visit.status ? "Terminée" : "Prévue"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Purchases */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                Achats Récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPurchases.map((purchase: RecentPurchase) => (
                  <div
                    key={purchase.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">
                        {purchase.accompanimentName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {purchase.purchaseItems.length} article(s)
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(purchase.createdAt).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600 text-sm">
                        {purchase.total.toLocaleString()} DJF
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-600" />
            Tableau de Bord
          </h3>

          {/* Active Accompaniments */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600" />
                Accompagnements Actifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user.accompaniments.slice(0, 3).map((acc) => (
                  <div
                    key={acc.id}
                    className="flex items-center gap-4 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg"
                  >
                    <div className="p-2 bg-emerald-100 rounded-full">
                      <Users className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{acc.name}</p>
                      <p className="text-xs text-gray-500">
                        {acc.members.length} membres
                      </p>
                      <p className="text-xs text-emerald-600">
                        Budget: {acc.budget.toLocaleString()} DJF
                      </p>
                    </div>
                    <Badge
                      variant={acc.status ? "default" : "secondary"}
                      className="bg-emerald-100 text-emerald-700"
                    >
                      {acc.status ? "Actif" : "En cours"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="border-0 shadow-md bg-gradient-to-br from-gray-50 to-slate-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gray-700" />
                Métriques de Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-xl font-bold text-emerald-600">
                    {statistics.totalVisits > 0
                      ? Math.round(
                          (statistics.completedVisits /
                            statistics.totalVisits) *
                            100
                        )
                      : 0}
                    %
                  </div>
                  <div className="text-xs text-gray-500">
                    Visites Complétées
                  </div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-xl font-bold text-blue-600">
                    {user.emargements.length > 0
                      ? Math.round(
                          (user.emargements.filter((em) => em.signature)
                            .length /
                            user.emargements.length) *
                            100
                        )
                      : 0}
                    %
                  </div>
                  <div className="text-xs text-gray-500">
                    Émargements Signés
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Efficacité Budgétaire
                  </span>
                  <span
                    className={`font-semibold text-sm ${
                      statistics.budgetUsagePercentage <= 80
                        ? "text-green-600"
                        : statistics.budgetUsagePercentage <= 95
                        ? "text-orange-600"
                        : "text-red-600"
                    }`}
                  >
                    {statistics.budgetUsagePercentage <= 80
                      ? "Excellente"
                      : statistics.budgetUsagePercentage <= 95
                      ? "Bonne"
                      : "Attention"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Center */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
        <CardHeader>
          <CardTitle className="text-xl text-white">
            Centre d'Actions Rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="secondary"
              className="h-16 flex flex-col items-center gap-2 bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <Plus className="h-5 w-5" />
              <span className="text-sm">Nouvel Accompagnement</span>
            </Button>
            <Button
              variant="secondary"
              className="h-16 flex flex-col items-center gap-2 bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <Calendar className="h-5 w-5" />
              <span className="text-sm">Planifier Visite</span>
            </Button>
            <Button
              variant="secondary"
              className="h-16 flex flex-col items-center gap-2 bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="text-sm">Nouvel Achat</span>
            </Button>
            <Button
              variant="secondary"
              className="h-16 flex flex-col items-center gap-2 bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">Signaler Conflit</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
