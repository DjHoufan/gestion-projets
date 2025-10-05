"use client"

import { useState, useEffect, useCallback} from "react"
import { Card, CardContent} from "@/core/components/ui/card"
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
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-orange-500 p-8 text-white">
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
          {/* Circular Stats Layout - Design Minimaliste */}
          <div className="relative h-[600px] w-full">
            {/* Cercles d'arrière-plan animés */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-[450px] h-[450px] rounded-full bg-gradient-to-br from-blue-50/30 to-purple-50/30 blur-3xl animate-pulse" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-teal-50/40 to-orange-50/40 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Centre - Bénéficiaires - Design Glassmorphism */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="relative w-60 h-60 rounded-full bg-gradient-to-br from-blue-500/90 via-blue-600/90 to-indigo-700/90 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center">
                {/* Effet de brillance */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent" />
                
                <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="rounded-full bg-white/30 backdrop-blur-md p-4 shadow-lg">
                    <Users className="h-12 w-12 text-white drop-shadow-lg" />
                  </div>
                  <p className="text-sm font-bold text-white/90 uppercase tracking-widest">Bénéficiaires</p>
                  <div className="text-5xl font-black text-white drop-shadow-xl">1,000</div>
                  <p className="text-xs text-white/70 font-medium">Jeunes filles</p>
                </div>
              </div>
            </div>

            {/* Les 4 autres cards - Design Glassmorphism */}
            {STATS_DATA.filter((_, i) => i !== 0).map((stat: StatItem, index: number) => {
              const Icon = stat.icon
              const angle = (index * 360 / 4) - 50
              const radius = 230
              const x = Math.round(Math.cos((angle * Math.PI) / 180) * radius * 100) / 100
              const y = Math.round(Math.sin((angle * Math.PI) / 180) * radius * 100) / 100
              
              // Couleurs de fond par index
              const gradients = [
                'from-orange-400/80 via-orange-500/80 to-orange-600/80',
                'from-red-400/80 via-red-500/80 to-red-600/80',
                'from-green-400/80 via-green-500/80 to-green-600/80',
                'from-purple-400/80 via-purple-500/80 to-purple-600/80'
              ]
              
              return (
                <div
                  key={index}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  }}
                >
                  <div className={`relative w-48 h-48 rounded-full bg-gradient-to-br ${gradients[index]} backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center group`}>
                    {/* Effet de brillance */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-2 p-4">
                      <div className="rounded-full bg-white/30 backdrop-blur-md p-3 shadow-lg">
                        <Icon className="h-7 w-7 text-white drop-shadow-lg" />
                      </div>
                      <p className="text-[11px] font-bold text-white/90 uppercase tracking-wider">{stat.title}</p>
                      <div className="text-3xl font-black text-white drop-shadow-xl">{stat.value}</div>
                    </div>
                  </div>
                </div>
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

        {/* Section Partenaires - Thème Clair avec Animations */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-blue-50/30 to-teal-50/30 p-12 border-2 border-slate-100">
          {/* Motifs décoratifs animés */}
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-blue-200 to-teal-200 blur-2xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-gradient-to-br from-orange-200 to-pink-200 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          <div className="relative z-10">
            {/* Titre simple et élégant */}
            <div className="text-center mb-12">
              <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-600 to-orange-600 inline-block">
                Nos Partenaires
              </h3>
            </div>
            
            
            {/* Grille de logos avec animations variées */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center justify-items-center">
              {[
                { url: "https://mrsjolhfnqzmuekkhzde.supabase.co/storage/v1/object/public/logo/mff_3.png", name: "MFF" },
                { url: "https://mrsjolhfnqzmuekkhzde.supabase.co/storage/v1/object/public/logo/MENFOP.png", name: "MENFOP" },
                { url: "https://mrsjolhfnqzmuekkhzde.supabase.co/storage/v1/object/public/logo/Minister%20sante.jpg", name: "Ministère de la santé" },
                { url: "https://mrsjolhfnqzmuekkhzde.supabase.co/storage/v1/object/public/logo/UNFD.jpg", name: "UNFD" },
                { url: "https://mrsjolhfnqzmuekkhzde.supabase.co/storage/v1/object/public/logo/121520894_3255625244548272_4630722496783989797_n%20(1).jpg", name: "Japon" },
                { url: "https://mrsjolhfnqzmuekkhzde.supabase.co/storage/v1/object/public/logo/la-banque-mondiale-logo.png", name: "Banque Mondiale" },
                { url: "https://mrsjolhfnqzmuekkhzde.supabase.co/storage/v1/object/public/logo/CPEC.jpg", name: "CPEC" },
                { url: "https://mrsjolhfnqzmuekkhzde.supabase.co/storage/v1/object/public/logo/CLE.png", name: "CLE" },
                { url: "https://mrsjolhfnqzmuekkhzde.supabase.co/storage/v1/object/public/logo/club%20des%20jeunes%20entrepreneurs.jpg", name: "Club des jeunes entrepreneurs" },
              ].map((partner, index) => (
                <div
                  key={index}
                  className="group relative"
                  style={{
                    animation: 'bounceIn 0.8s ease-out forwards',
                    animationDelay: `${index * 0.08}s`,
                    opacity: 0
                  }}
                >
                  {/* Card avec effet 3D */}
                  <div className="relative bg-white rounded-2xl w-48 h-48 flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-110 border border-slate-200 group-hover:border-teal-300">
                    {/* Effet de brillance qui traverse */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 group-hover:animate-shine" />
                    </div>
                    
                    {/* Cercle coloré d'arrière-plan qui apparaît au hover */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/0 via-teal-400/0 to-orange-400/0 group-hover:from-blue-400/10 group-hover:via-teal-400/10 group-hover:to-orange-400/10 transition-all duration-500" />
                    
                    {/* Logo - Taille fixe pour tous */}
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <img
                        src={partner.url}
                        alt={partner.name}
                        className="w-full h-full object-contain transition-all duration-500 group-hover:drop-shadow-xl"
                      />
                    </div>
                  </div>

                  {/* Badge avec nom au hover */}
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
                    <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
                      {partner.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Animations personnalisées */}
        <style jsx>{`
          @keyframes bounceIn {
            0% {
              opacity: 0;
              transform: scale(0.3) translateY(50px);
            }
            50% {
              transform: scale(1.05) translateY(-5px);
            }
            70% {
              transform: scale(0.95) translateY(0);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          
          @keyframes shine {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </div>
    </div>
  )
}

export default Main
