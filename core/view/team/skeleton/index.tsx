import { Skeleton } from "@/core/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/core/components/ui/card"

export function InformationsSkeleton() {
  return (
    <Card className="!p-0 shadow-lg border border-gray-200 overflow-hidden bg-white">
      <CardHeader className="p-5 bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg bg-white/20" />
          <Skeleton className="h-6 w-48 bg-white/20" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-4 h-4 bg-gray-200" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-16 bg-gray-200" />
                <Skeleton className="h-4 w-32 bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
        <div className="h-px bg-gray-200" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20 bg-gray-200" />
              <Skeleton className="h-4 w-24 bg-gray-200" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ConflitsSkeleton() {
  return (
    <Card className="!p-0 shadow-lg border border-gray-200 overflow-hidden bg-white">
      <CardHeader className="p-5 bg-gradient-to-r from-red-500 to-red-600">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg bg-white/20" />
          <Skeleton className="h-6 w-32 bg-white/20" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4 bg-white">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-red-50 rounded-xl p-6 space-y-4 border border-red-100">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full bg-gray-200" />
                <Skeleton className="h-4 w-3/4 bg-gray-200" />
                <Skeleton className="h-3 w-32 bg-gray-200" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full bg-gray-200" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-20 bg-gray-200" />
              <Skeleton className="h-3 w-full bg-gray-200" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-5 w-24 rounded-full bg-gray-200" />
              <Skeleton className="h-5 w-32 rounded-full bg-gray-200" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function PlanningsSkeleton() {
  return (
    <Card className="!p-0 shadow-lg border border-gray-200 overflow-hidden bg-white">
      <CardHeader className="p-5 bg-gradient-to-r from-green-500 to-green-600">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg bg-white/20" />
          <Skeleton className="h-6 w-32 bg-white/20" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6 bg-white">
        {Array.from({ length: 1 }).map((_, i) => (
          <div key={i} className="bg-green-50 rounded-xl p-6 space-y-4 border border-green-100">
            <Skeleton className="h-5 w-32 bg-gray-200" />
            <div className="bg-white rounded-lg p-3 space-y-2 border border-green-200">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-40 bg-gray-200" />
                <Skeleton className="h-5 w-20 rounded-full bg-gray-200" />
              </div>
              <Skeleton className="h-3 w-24 bg-gray-200" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-5 w-20 rounded-full bg-gray-200" />
                <Skeleton className="h-5 w-20 rounded-full bg-gray-200" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-gray-200" />
              <div className="bg-white rounded-lg p-3 space-y-2 border border-green-200">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32 bg-gray-200" />
                  <Skeleton className="h-5 w-20 rounded-full bg-gray-200" />
                </div>
                <Skeleton className="h-3 w-48 bg-gray-200" />
                <Skeleton className="h-3 w-24 bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function AccompagnementsSkeleton() {
  return (
    <Card className="!p-0 shadow-lg border border-gray-200 overflow-hidden bg-white">
      <CardHeader className="p-5 bg-gradient-to-r from-purple-500 to-purple-600">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg bg-white/20" />
          <Skeleton className="h-6 w-40 bg-white/20" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6 bg-white">
        {Array.from({ length: 1 }).map((_, i) => (
          <div key={i} className="bg-purple-50 rounded-xl p-6 space-y-4 border border-purple-100">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40 bg-gray-200" />
                <Skeleton className="h-3 w-24 bg-gray-200" />
                <Skeleton className="h-3 w-48 bg-gray-200" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full bg-gray-200" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-5 w-24 rounded-full bg-gray-200" />
              <Skeleton className="h-5 w-24 rounded-full bg-gray-200" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 bg-gray-200" />
                <Skeleton className="h-4 w-32 bg-gray-200" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 space-y-2 border border-purple-200">
                  <Skeleton className="h-4 w-32 bg-gray-200" />
                  <Skeleton className="h-3 w-24 bg-gray-200" />
                  <div className="flex flex-wrap gap-1">
                    <Skeleton className="h-4 w-16 rounded-full bg-gray-200" />
                    <Skeleton className="h-4 w-16 rounded-full bg-gray-200" />
                    <Skeleton className="h-4 w-20 rounded-full bg-gray-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
