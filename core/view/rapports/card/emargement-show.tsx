"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/core/components/ui/dialog"
import { Button } from "@/core/components/ui/button"
import { Badge } from "@/core/components/ui/badge"
import { Card, CardContent } from "@/core/components/ui/card"
import { Avatar, AvatarFallback } from "@/core/components/ui/avatar"
import { Progress } from "@/core/components/ui/progress"
import {
  FileCheck,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  PenTool,
  Calendar,
  Hash,
  Download,
  PrinterIcon as Print,
  Share2,
  Shield,
} from "lucide-react"

export default function EmeraldAttendanceDialog() {
  const [open, setOpen] = useState(false)

  const sessionData = {
    id: "99978092-6d2c-48b5-a480-a0b0f1d570c3",
    date: "2025-07-22T17:59:11.894Z",
    signature: false,
    cni: "5555555",
    montant: 80000,
    observations: "ras",
    member: {
      name: "Farah Osman",
      email: "akis.med05s@gmail.com",
      phone: "+25377231659",
      address: "akis",
      gender: "homme",
      formation: "rrrrrrrrrr",
      center: "rrrrrrrrrrrrrrrrrrrr",
    },
    accompanist: {
      name: "Yacin Ali Abdillahi",
      email: "akis.med04@gmail.com",
      phone: "+25377635553",
      address: "Djibouti ville",
      type: "accompanist",
    },
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-DJ", {
      style: "currency",
      currency: "DJF",
    }).format(amount)
  }

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-gray-50 p-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-12 py-6 text-xl font-semibold shadow-lg rounded-xl border-0 transition-all duration-300"
          >
            <FileCheck className="w-6 h-6 mr-3" />
            Fichier d'Émargement
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0 gap-0 bg-white rounded-2xl border shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Fichier d'Émargement</DialogTitle>
          </DialogHeader>

          {/* Design avec accents émeraude */}
          <div className="bg-white">
            {/* Header avec émeraude */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                    <FileCheck className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">FICHIER D'ÉMARGEMENT</h1>
                    <p className="text-emerald-100 text-lg">Session de Formation</p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <p className="text-emerald-100 text-sm mb-1">Session</p>
                  <p className="font-mono text-xl font-bold text-white">#{sessionData.id.slice(0, 6).toUpperCase()}</p>
                </div>
              </div>

              {/* Progress bar avec émeraude */}
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Progression</span>
                  <span className="text-emerald-100">{sessionData.signature ? "100%" : "75%"}</span>
                </div>
                <Progress value={sessionData.signature ? 100 : 75} className="h-2 bg-white/20" />
                <div className="flex items-center justify-between mt-2 text-sm text-emerald-100">
                  <span>Participant inscrit</span>
                  <span>{sessionData.signature ? "Complété" : "En attente"}</span>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Stats avec accents émeraude */}
              <div className="grid grid-cols-4 gap-6">
                <Card className="border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Date</p>
                    <p className="font-semibold text-gray-900">{formatDateOnly(sessionData.date).split(",")[0]}</p>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Heure</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(sessionData.date).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Hash className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Montant</p>
                    <p className="font-semibold text-emerald-700 text-sm">{formatAmount(sessionData.montant)}</p>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      {sessionData.signature ? (
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <Clock className="w-6 h-6 text-emerald-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Statut</p>
                    <Badge
                      variant={sessionData.signature ? "default" : "secondary"}
                      className={`text-xs px-3 py-1 rounded-full ${
                        sessionData.signature
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-700 border-gray-300"
                      }`}
                    >
                      {sessionData.signature ? "Signé" : "Attente"}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Profils avec accents émeraude */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Participant */}
                <Card className="border border-gray-200 shadow-lg hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
                  <div className="bg-gradient-to-r from-emerald-50 to-gray-50 border-b border-emerald-100 p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16 border-2 border-emerald-200">
                        <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold text-lg">
                          {getInitials(sessionData.member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{sessionData.member.name}</h3>
                        <Badge variant="outline" className="border-emerald-300 text-emerald-700 bg-emerald-50">
                          Participant
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-emerald-200 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                              <Mail className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Email</p>
                              <p className="font-semibold text-gray-900 text-sm">{sessionData.member.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-emerald-200 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                              <Phone className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Téléphone</p>
                              <p className="font-semibold text-gray-900 text-sm">{sessionData.member.phone}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-emerald-200 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">CNI</p>
                            <p className="font-mono font-bold text-gray-900">{sessionData.cni}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-emerald-200 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Adresse</p>
                            <p className="font-semibold text-gray-900">{sessionData.member.address}</p>
                          </div>
                        </div>
                      </div>

                      {/* Zone de signature avec émeraude */}
                      <div className="bg-emerald-50 rounded-lg p-6 border-2 border-dashed border-emerald-300">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center mx-auto mb-3">
                            {sessionData.signature ? (
                              <CheckCircle className="w-6 h-6 text-emerald-700" />
                            ) : (
                              <PenTool className="w-6 h-6 text-emerald-700" />
                            )}
                          </div>
                          <p className="font-semibold text-emerald-800 mb-2">
                            {sessionData.signature ? "Signature confirmée" : "Signature requise"}
                          </p>
                          <p className="text-sm text-emerald-700">
                            {sessionData.signature ? "Participant présent" : "En attente de présence"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Accompagnateur */}
                <Card className="border border-gray-200 shadow-lg hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
                  <div className="bg-gradient-to-r from-gray-50 to-emerald-50 border-b border-gray-200 p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16 border-2 border-gray-300">
                        <AvatarFallback className="bg-gray-200 text-gray-700 font-bold text-lg">
                          {getInitials(sessionData.accompanist.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{sessionData.accompanist.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="border-gray-300 text-gray-600 bg-white">
                            {sessionData.accompanist.type}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Shield className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-600 text-sm font-medium">Certifié</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-emerald-200 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Mail className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                              <p className="font-semibold text-gray-900 text-sm">{sessionData.accompanist.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-emerald-200 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Phone className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Téléphone</p>
                              <p className="font-semibold text-gray-900 text-sm">{sessionData.accompanist.phone}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-emerald-200 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Adresse</p>
                            <p className="font-semibold text-gray-900">{sessionData.accompanist.address}</p>
                          </div>
                        </div>
                      </div>

                      {/* Zone de validation avec accent émeraude */}
                      <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-emerald-300">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Shield className="w-6 h-6 text-emerald-600" />
                          </div>
                          <p className="font-semibold text-gray-800 mb-2">Validation Officielle</p>
                          <p className="text-sm text-gray-600 mb-4">Signature et cachet du responsable</p>
                          <div className="h-16 border-2 border-dashed border-emerald-400 rounded-lg bg-white flex items-center justify-center">
                            <span className="text-emerald-600 text-sm font-medium">Zone de signature</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Footer avec boutons émeraude */}
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
                    <div className="text-center lg:text-left">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Document Officiel</h3>
                      <p className="text-gray-600 mb-1">Fichier d'émargement généré automatiquement</p>
                      <p className="text-sm text-gray-500">{formatDate(new Date().toISOString())}</p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl px-8 py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <Share2 className="w-5 h-5 mr-2" />
                        Partager
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-white rounded-xl px-8 py-3 font-semibold hover:shadow-md transition-all duration-200"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Télécharger
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-white rounded-xl px-8 py-3 font-semibold hover:shadow-md transition-all duration-200"
                      >
                        <Print className="w-5 h-5 mr-2" />
                        Imprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
