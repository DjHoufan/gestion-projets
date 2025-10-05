"use client"

import { useState, useEffect, useCallback} from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"
import { Sparkles, Users, TrendingUp, UserX, DollarSign, Briefcase, ChevronLeft, ChevronRight,   LucideIcon } from "lucide-react"

interface StatItem {
  title: string
  value: string
  icon: LucideIcon
  description: string
  colorBorder: string
  colorBg: string
  colorTitle: string
  colorIconBg: string
  colorIcon: string
  colorValue: string
  colorDesc: string
}

// Images statiques - en dehors du composant pour éviter re-création
const CAROUSEL_IMAGES = [
  "https://mrsjolhfnqzmuekkhzde.supabase.co/storage/v1/object/public/cohorte/c1/3M4A0316.JPG",
  "https://mrsjolhfnqzmuekkhzde.supabase.co/storage/v1/object/public/cohorte/c1/3M4A0317.JPG",
  "https://mrsjolhfnqzmuekkhzde.supabase.co/storage/v1/object/public/cohorte/c1/3M4A0320.JPG",
  "https://mrsjolhfnqzmuekkhzde.supabase.co/storage/v1/object/public/cohorte/c1/3M4A5486.JPG",
] as const

// Stats statiques - en dehors du composant
const STATS_DATA: StatItem[] = [
    {
      title: "Bénéficiaires",
      value: "1,000",
      icon: Users,
      description: "Jeunes filles",
      colorBorder: "border-blue-200",
      colorBg: "bg-gradient-to-br from-blue-50 to-blue-100",
      colorTitle: "text-blue-900",
      colorIconBg: "bg-blue-100",
      colorIcon: "text-blue-600",
      colorValue: "text-blue-700",
      colorDesc: "text-blue-600",
    },
    {
      title: "AGR Créées",
      value: "537",
      icon: TrendingUp,
      description: "Activités génératrices",
      colorBorder: "border-orange-200",
      colorBg: "bg-gradient-to-br from-orange-50 to-orange-100",
      colorTitle: "text-orange-900",
      colorIconBg: "bg-orange-100",
      colorIcon: "text-orange-600",
      colorValue: "text-orange-700",
      colorDesc: "text-orange-600",
    },
    {
      title: "Taux d'Abandon",
      value: "3%",
      icon: UserX,
      description: "Très faible abandon",
      colorBorder: "border-red-200",
      colorBg: "bg-gradient-to-br from-red-50 to-red-100",
      colorTitle: "text-red-900",
      colorIconBg: "bg-red-100",
      colorIcon: "text-red-600",
      colorValue: "text-red-700",
      colorDesc: "text-red-600",
    },
    {
      title: "Impact Économique",
      value: "$965K",
      icon: DollarSign,
      description: "Injecté dans l'économie",
      colorBorder: "border-green-200",
      colorBg: "bg-gradient-to-br from-green-50 to-green-100",
      colorTitle: "text-green-900",
      colorIconBg: "bg-green-100",
      colorIcon: "text-green-600",
      colorValue: "text-green-700",
      colorDesc: "text-green-600",
    },
    {
      title: "Emplois Créés",
      value: "200+",
      icon: Briefcase,
      description: "Nouveaux emplois",
      colorBorder: "border-purple-200",
      colorBg: "bg-gradient-to-br from-purple-50 to-purple-100",
      colorTitle: "text-purple-900",
      colorIconBg: "bg-purple-100",
      colorIcon: "text-purple-600",
      colorValue: "text-purple-700",
      colorDesc: "text-purple-600",
    },
]

const Main = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)

  // Auto-rotate images avec useCallback pour éviter re-création
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev: number) => (prev + 1) % CAROUSEL_IMAGES.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev: number) => (prev + 1) % CAROUSEL_IMAGES.length)
  }, [])

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev: number) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length)
  }, [])

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-orange-500 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-medium opacity-90">
                    Plateforme HOUFAN
                  </span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    Tableau de Bord Intelligent
                  </h2>
                  <p className="text-lg opacity-90 max-w-2xl">
                    Piloter l&apos;accompagnement des jeunes bénéficiaires avec des
                    outils avancés et en temps réel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid - Stats and Carousel Side by Side */}
        <div className="grid gap-6 lg:grid-cols-2 items-stretch">
          {/* Detailed Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 content-start h-full">
            {STATS_DATA.map((stat: StatItem, index: number) => {
              const Icon = stat.icon
              return (
                <Card
                  key={index}
                  className={`${stat.colorBorder} ${stat.colorBg} shadow-lg hover:shadow-xl transition-shadow duration-300`}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className={`text-sm font-medium ${stat.colorTitle}`}>{stat.title}</CardTitle>
                    <div className={`rounded-full ${stat.colorIconBg} p-2`}>
                      <Icon className={`h-5 w-5 ${stat.colorIcon}`} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className={`text-3xl font-bold ${stat.colorValue}`}>{stat.value}</div>
                    <p className={`text-sm font-semibold ${stat.colorDesc}`}>{stat.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Custom Carousel Section */}
          <Card className="p-0 border-slate-200 bg-white shadow-2xl overflow-hidden h-full flex flex-col">
            <CardContent className="p-0 flex-1 flex flex-col">
              {/* Image Display */}
              <div className="relative flex-1 overflow-hidden group">
                {CAROUSEL_IMAGES.map((image: string, index: number) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      index === currentImageIndex
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-110"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover brightness-105 contrast-105"
                    />
                    {/* Overlay Gradient léger */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                ))}
                
                {/* Navigation Buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-teal-600 p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-teal-600 p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
              
              {/* Barre colorée en bas */}
              <div className="relative bg-gradient-to-r from-teal-500 via-teal-600 to-orange-500 p-6">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="text-sm font-medium opacity-90 mb-1">HOUFAN</p>
                    <h3 className="text-2xl font-bold">Galerie du Programme</h3>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <p className="text-lg font-semibold">Photo {currentImageIndex + 1} sur {CAROUSEL_IMAGES.length}</p>
                    <div className="flex gap-2">
                      {CAROUSEL_IMAGES.map((_: string, dotIndex: number) => (
                        <button
                          key={dotIndex}
                          onClick={() => setCurrentImageIndex(dotIndex)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            dotIndex === currentImageIndex
                              ? "bg-white w-8"
                              : "bg-white/50 w-2 hover:bg-white/70"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Main
