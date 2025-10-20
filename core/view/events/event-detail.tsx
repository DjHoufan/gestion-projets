"use client";
import React, { useMemo, useState, useEffect } from "react";
import { IdType, PermissionProps } from "@/core/lib/types";
import { definePermissions } from "@/core/lib/utils";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import {
  Calendar,
  ArrowLeft,
  Image as ImageIcon,
  Presentation,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  Play,
  Pause,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import { useGetOnEvent } from "@/core/hooks/use-events";
import { Spinner } from "@/core/components/ui/spinner";

export function EventDetail({ Id }: IdType ) {
  //details
  const { data: rawEvent, isPending } = useGetOnEvent(Id);
  const router = useRouter();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pptDialogOpen, setPptDialogOpen] = useState(false);
  const [selectedPpt, setSelectedPpt] = useState<any>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

 
  const event = useMemo(() => {
    if (!rawEvent) return null;

    // Si rawEvent a une propriété 'files', on la prend directement
    if ((rawEvent as any).files) return rawEvent as any;

    // Si c'est un objet avec des clés numériques (ex: "0", "1"), renvoyer le premier
    const numericKey = Object.keys(rawEvent).find((k) => /^\d+$/.test(k));
    if (numericKey) return (rawEvent as any)[numericKey];

    // Si rawEvent est un tableau, retourner le premier élément
    if (Array.isArray(rawEvent) && rawEvent.length > 0) return rawEvent[0];

    // fallback
    return rawEvent as any;
  }, [rawEvent]);

  // Memoize images et powerpoints — protège si event ou event.files est undefined
  const images = useMemo(
    () => (event?.files ? (event.files as any[]).filter((f) => f.type === "image") : []),
    [event]
  );
  const powerpoints = useMemo(
    () =>
      (event?.files ? (event.files as any[]).filter((f) => f.type === "powerpoint") : []),
    [event]
  );

  // Reset index si les images changent (utile si on navigue entre événements)
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [images.length]);

  // Auto-play du carousel
  useEffect(() => {
    if (!images || images.length <= 1 || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images, isAutoPlaying]);

  // Sécurités supplémentaires pour éviter crash si images vide
  const safeCurrentImage = images.length > 0 ? images[currentImageIndex % images.length] : null;

  if (isPending || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <Spinner className="text-primary" variant="bars" size={80} />
      </div>
    );
  }

  const nextImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setIsAutoPlaying(false);
  };

  const prevImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
  };

  const toggleAutoPlay = () => setIsAutoPlaying((s) => !s);

  const handleViewPpt = (file: any) => {
    setSelectedPpt(file);
    setPptDialogOpen(true);
  };

  /// akis 

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Bouton retour */}
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux événements
        </Button>

        {/* En-tête de l'événement */}
        <Card className="mb-6 border-2 border-teal-200 bg-gradient-to-br from-white to-teal-50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl text-teal-800 mb-3">
                  {event.titre}
                </CardTitle>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-5 w-5 text-teal-600" />
                  <span className="font-medium">
                    {event.date
                      ? new Date(event.date).toLocaleDateString("fr-FR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Date non définie"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-blue-100 text-blue-800">
                  <ImageIcon className="h-3 w-3 mr-1" />
                  {images.length} image{images.length > 1 ? "s" : ""}
                </Badge>
                <Badge className="bg-orange-100 text-orange-800">
                  <Presentation className="h-3 w-3 mr-1" />
                  {powerpoints.length} présentation{powerpoints.length > 1 ? "s" : ""}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Carousel des images */}
        {images.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-xl shadow-lg">
                  <ImageIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Galerie Photos</h2>
                  <p className="text-sm text-gray-600">
                    {currentImageIndex + 1} sur {images.length} images
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={toggleAutoPlay} variant="outline" className="flex items-center gap-2">
                  {isAutoPlaying ? (
                    <>
                      <Pause className="h-4 w-4" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" /> Lecture
                    </>
                  )}
                </Button>

                {safeCurrentImage && (
                  <a
                    href={safeCurrentImage.url}
                    download
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg shadow-md transition-all"
                  >
                    <Download className="h-4 w-4" />
                    Télécharger
                  </a>
                )}
              </div>
            </div>

            <Card className="p-0 overflow-hidden border-2 border-gray-200 shadow-xl">
              <CardContent className="p-0">
                <div className="relative group">
                  <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
                    {safeCurrentImage ? (
                      <img
                        src={safeCurrentImage.url}
                        alt={safeCurrentImage.name || "image"}
                        className="w-full h-[600px] object-contain transition-all duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-[600px] flex items-center justify-center text-white">
                        Aucune image
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-6 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="h-6 w-6 text-white" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-6 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="h-6 w-6 text-white" />
                      </button>
                    </>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6">
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
                      {images.map((image: any, index: number) => (
                        <div
                          key={image.id}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 cursor-pointer transition-all duration-300 transform ${
                            index === currentImageIndex
                              ? "scale-110 ring-4 ring-blue-500 shadow-xl"
                              : "hover:scale-105 ring-2 ring-gray-300 hover:ring-blue-300 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <div className="relative rounded-xl overflow-hidden">
                            <img src={image.url} alt={image.name} className="w-28 h-28 object-cover" />
                            {index === currentImageIndex && (
                              <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                                <div className="bg-blue-500 text-white rounded-full p-2">
                                  <Eye className="h-4 w-4" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {images.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentImageIndex ? "w-8 h-3 bg-gradient-to-r from-blue-500 to-purple-500" : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Liste des PowerPoints */}
        {powerpoints.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Presentation className="h-5 w-5 text-orange-600" />
                Présentations PowerPoint ({powerpoints.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {powerpoints.map((file: any) => (
                  <Card key={file.id} className="hover:shadow-lg transition-all border-2 hover:border-orange-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-orange-100 p-4 rounded-full mb-4">
                          <Presentation className="h-12 w-12 text-orange-600" />
                        </div>
                        <p className="font-medium text-gray-800 mb-2 line-clamp-2">{file.name}</p>
                        <div className="flex gap-2 mt-4 w-full">
                          <Button onClick={() => handleViewPpt(file)} className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                            <Eye className="h-4 w-4 mr-2" />
                            Consulter
                          </Button>
                          <a href={file.url} download className="inline-flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all">
                            <Download className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Message si aucun fichier */}
        {images.length === 0 && powerpoints.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">Aucun fichier disponible</h3>
              <p className="text-gray-500">Cet événement ne contient pas encore de fichiers</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog pour consulter le PowerPoint */}
      <Dialog open={pptDialogOpen} onOpenChange={setPptDialogOpen}>
        <DialogContent className="!max-w-6xl h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Presentation className="h-5 w-5 text-orange-600" />
                {selectedPpt?.name}
              </div>
              {selectedPpt && (
                <a href={selectedPpt.url} download className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Télécharger
                </a>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 h-[calc(90vh-100px)]">
            {selectedPpt ? (
              <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(selectedPpt.url)}`}
                className="w-full h-full rounded-lg border border-gray-200"
                frameBorder="0"
                title={selectedPpt.name}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">Aucun fichier sélectionné</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
