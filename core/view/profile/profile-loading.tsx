import { Card, CardContent } from "@/core/components/ui/card";
import { Skeleton } from "@/core/components/ui/skeleton";

export function LoadingProfile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30">
      {/* Header avec gradient */}
      <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 pb-32">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-6 pt-8">
          <div className="flex justify-between items-start">
            <div className="text-white">
              <Skeleton className="h-8 w-48 bg-white/20 mb-2" />
              <Skeleton className="h-4 w-64 bg-white/10" />
            </div>
            <Skeleton className="h-8 w-8 bg-white/20 rounded" />
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-6 -mt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Card principale du profil */}
          <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                {/* Avatar et infos principales */}
                <div className="flex flex-col items-center text-center lg:text-left">
                  <Skeleton className="w-32 h-32 rounded-full mb-4" />
                  <Skeleton className="h-8 w-24 rounded" />
                </div>

                {/* Informations principales */}
                <div className="flex-1 space-y-6">
                  <div>
                    <Skeleton className="h-10 w-64 mb-4" />
                    <div className="flex flex-wrap gap-3 mb-4">
                      <Skeleton className="h-6 w-32 rounded-full" />
                      <Skeleton className="h-6 w-28 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </div>

                  {/* Contact rapide */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div className="flex-1">
                        <Skeleton className="h-3 w-12 mb-2" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div className="flex-1">
                        <Skeleton className="h-3 w-16 mb-2" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Skeleton className="h-10 w-36 rounded" />
                    <Skeleton className="h-10 w-28 rounded" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grille des informations détaillées */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informations personnelles */}
            <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <Skeleton className="h-6 w-48" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="group">
                        <Skeleton className="h-3 w-24 mb-2" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="group">
                        <Skeleton className="h-3 w-20 mb-2" />
                        <Skeleton className="h-5 w-36" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations système */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <Skeleton className="h-6 w-20" />
                </div>

                <div className="space-y-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <Skeleton className="h-3 w-24 mb-2" />
                      <Skeleton className="h-8 w-full rounded-lg" />
                    </div>
                  ))}

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
              >
                <CardContent className="p-6 text-center">
                  <Skeleton className="h-8 w-12 mx-auto mb-2 bg-white/20" />
                  <Skeleton className="h-4 w-20 mx-auto bg-white/10" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
