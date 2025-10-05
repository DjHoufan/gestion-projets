"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"
import { Calendar, Clock } from "lucide-react"

interface Cohorte {
  id: string
  name: string
  startDate: Date
  endDate: Date
  color: string
  bgColor: string
  borderColor: string
}

const COHORTES: Cohorte[] = [
  {
    id: "c1",
    name: "Cohorte 1",
    startDate: new Date("2024-11-28"),
    endDate: new Date("2024-12-25"),
    color: "text-blue-600",
    bgColor: "bg-blue-500",
    borderColor: "border-blue-200",
  },
  {
    id: "c2",
    name: "Cohorte 2",
    startDate: new Date("2025-04-07"),
    endDate: new Date("2025-05-06"),
    color: "text-green-600",
    bgColor: "bg-green-500",
    borderColor: "border-green-200",
  },
  {
    id: "c3",
    name: "Cohorte 3",
    startDate: new Date("2025-04-10"),
    endDate: new Date("2025-05-12"),
    color: "text-purple-600",
    bgColor: "bg-purple-500",
    borderColor: "border-purple-200",
  },
  {
    id: "c4",
    name: "Cohorte 4",
    startDate: new Date("2025-05-25"),
    endDate: new Date("2025-06-19"),
    color: "text-orange-600",
    bgColor: "bg-orange-500",
    borderColor: "border-orange-200",
  },
  {
    id: "c5",
    name: "Cohorte 5",
    startDate: new Date("2025-06-02"),
    endDate: new Date("2025-06-30"),
    color: "text-pink-600",
    bgColor: "bg-pink-500",
    borderColor: "border-pink-200",
  },
  {
    id: "accompagnement",
    name: "Accompagnement",
    startDate: new Date("2025-04-01"),
    endDate: new Date("2025-06-30"),
    color: "text-cyan-600",
    bgColor: "bg-cyan-500",
    borderColor: "border-cyan-200",
  },
]

const Main2 = () => {
  // Calculer la plage de dates globale
  const { minDate, maxDate, totalDays } = useMemo(() => {
    const allDates = COHORTES.flatMap((c) => [c.startDate, c.endDate])
    const min = new Date(Math.min(...allDates.map((d) => d.getTime())))
    const max = new Date(Math.max(...allDates.map((d) => d.getTime())))
    
    // Ajouter une marge
    min.setDate(min.getDate() - 7)
    max.setDate(max.getDate() + 7)
    
    const days = Math.ceil((max.getTime() - min.getTime()) / (1000 * 60 * 60 * 24))
    return { minDate: min, maxDate: max, totalDays: days }
  }, [])

  // Générer les mois pour l'axe X
  const monthsAxis = useMemo(() => {
    const months: { label: string; width: number }[] = []
    const current = new Date(minDate)
    
    while (current <= maxDate) {
      const month = current.toLocaleDateString("fr-FR", { month: "short", year: "numeric" })
      const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate()
      const width = (daysInMonth / totalDays) * 100
      
      months.push({ label: month, width })
      current.setMonth(current.getMonth() + 1)
    }
    
    return months
  }, [minDate, maxDate, totalDays])

  // Calculer la position et la largeur de chaque cohorte
  const getBarPosition = (cohorte: Cohorte) => {
    const startOffset = (cohorte.startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)
    const duration = (cohorte.endDate.getTime() - cohorte.startDate.getTime()) / (1000 * 60 * 60 * 24)
    
    const left = (startOffset / totalDays) * 100
    const width = (duration / totalDays) * 100
    
    return { left: `${left}%`, width: `${width}%` }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
  }

  const getDuration = (start: Date, end: Date) => {
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return `${days} jours`
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-orange-500 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-6 w-6" />
              <span className="text-sm font-medium opacity-90">Planning des Cohortes</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">Diagramme de Gantt</h2>
            <p className="text-lg opacity-90">
              Visualisation chronologique des 5 cohortes du programme HOUFAN
            </p>
          </div>
        </div>

        {/* Gantt Chart */}
        <Card className="border-slate-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-teal-600" />
              Calendrier des Cohortes 2024-2025
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Timeline Header - Mois */}
            <div className="mb-4 border-b pb-2">
              <div className="flex">
                <div className="w-40 flex-shrink-0"></div>
                <div className="flex-1 flex">
                  {monthsAxis.map((month, index) => (
                    <div
                      key={index}
                      style={{ width: `${month.width}%` }}
                      className="text-center text-sm font-semibold text-gray-700 border-l first:border-l-0 px-2"
                    >
                      {month.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Gantt Bars */}
            <div className="space-y-4">
              {COHORTES.map((cohorte) => {
                const position = getBarPosition(cohorte)
                return (
                  <div key={cohorte.id} className="group">
                    <div className="flex items-center">
                      {/* Cohorte Label */}
                      <div className="w-40 flex-shrink-0 pr-4">
                        <div className={`font-bold ${cohorte.color} text-sm`}>
                          {cohorte.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {getDuration(cohorte.startDate, cohorte.endDate)}
                        </div>
                      </div>

                      {/* Timeline Bar */}
                      <div className="flex-1 relative h-14">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex">
                          {monthsAxis.map((month, index) => (
                            <div
                              key={index}
                              style={{ width: `${month.width}%` }}
                              className="border-l border-gray-100 first:border-l-0"
                            />
                          ))}
                        </div>

                        {/* Bar */}
                        <div
                          className={`absolute top-2 h-10 ${cohorte.bgColor} rounded-lg shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 cursor-pointer border-2 ${cohorte.borderColor}`}
                          style={position}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-lg" />
                          <div className="relative h-full flex items-center justify-center px-3">
                            <span className="text-xs font-semibold text-white truncate">
                              {formatDate(cohorte.startDate)} → {formatDate(cohorte.endDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex flex-wrap gap-4">
                {COHORTES.map((cohorte) => (
                  <div key={cohorte.id} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${cohorte.bgColor}`} />
                    <span className="text-sm font-medium text-gray-700">
                      {cohorte.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({formatDate(cohorte.startDate)} - {formatDate(cohorte.endDate)})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-teal-100">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-teal-900 mb-2">Total Cohortes</div>
              <div className="text-3xl font-bold text-teal-600">{COHORTES.length}</div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-blue-900 mb-2">Période Totale</div>
              <div className="text-3xl font-bold text-blue-600">{totalDays} jours</div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-purple-900 mb-2">Durée Moyenne</div>
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(
                  COHORTES.reduce((acc, c) => 
                    acc + (c.endDate.getTime() - c.startDate.getTime()) / (1000 * 60 * 60 * 24), 0
                  ) / COHORTES.length
                )} jours
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Main2
