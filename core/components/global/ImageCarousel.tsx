"use client";

import { useState, useEffect, useCallback, memo, useRef } from "react";
import { ChevronLeft, ChevronRight, Camera, Play, Pause } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";

interface AkisCarouselProps {
  images: string[];
  title?: string;
  description?: string;
  autoPlayInterval?: number;
  height?: string;
  showCounter?: boolean;
  showProgressBar?: boolean;
}

const ImageCarousel = memo(
  ({
    images,
    title = "Album Photo",
    description = "Cohorte 1 - Programme de Formation",
    autoPlayInterval = 4000,
    height = "700px",
    showCounter = true,
    showProgressBar = true,
  }: AkisCarouselProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const preloadedImages = useRef<Set<string>>(new Set());

    // --- Préchargement d'une image dans le cache navigateur
    const preloadImage = useCallback((src: string) => {
      if (!src || preloadedImages.current.has(src)) return;
      const img = new Image();
      img.src = src;
      img.loading = "eager";
      preloadedImages.current.add(src);
    }, []);

    // --- Précharger l'image suivante à chaque changement de slide
    useEffect(() => {
      if (images.length === 0) return;

      const nextIndex = (currentSlide + 1) % images.length;
      preloadImage(images[nextIndex]);
    }, [currentSlide, images, preloadImage]);

    // --- Auto-play carousel
    useEffect(() => {
      if (!isAutoPlay || images.length === 0) return;
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
      }, autoPlayInterval);
      return () => clearInterval(timer);
    }, [isAutoPlay, images.length, autoPlayInterval]);

    const nextSlide = useCallback(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevSlide = useCallback(() => {
      setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    const toggleAutoPlay = useCallback(() => {
      setIsAutoPlay((prev) => !prev);
    }, []);

    if (!images || images.length === 0) {
      return (
        <Card className="border-2 border-slate-200 bg-white shadow-2xl">
          <CardContent className="p-8 text-center text-slate-500">
            Aucune image disponible
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="p-0 gap-0 border-2 border-slate-200 bg-white shadow-2xl overflow-hidden">
        <CardHeader className="p-5 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Camera className="h-6 w-6 text-emerald-600" />
              <CardTitle className="text-2xl text-slate-900">{title}</CardTitle>
            </div>
            <div className="flex items-center">
              {showCounter && (
                <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold">
                  {currentSlide + 1} / {images.length}
                </div>
              )}
              <button
                onClick={toggleAutoPlay}
                className="bg-white hover:bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-all border-2 border-emerald-200 hover:border-emerald-400"
                aria-label={
                  isAutoPlay ? "Mettre en pause" : "Lancer le diaporama"
                }
              >
                {isAutoPlay ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isAutoPlay ? "Pause" : "Play"}
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="relative group">
            <div
              className="relative overflow-hidden bg-slate-900"
              style={{ height }}
            >
              <div
                className="flex transition-transform duration-700 ease-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {images.map((image, index) => {
                  const isVisible =
                    index === currentSlide ||
                    index ===
                      (currentSlide - 1 + images.length) % images.length ||
                    index === (currentSlide + 1) % images.length;

                  return (
                    <div
                      key={`${image}-${index}`}
                      className="min-w-full h-full relative flex-shrink-0"
                    >
                      {isVisible && (
                        <>
                          <img
                            src={image}
                            alt={`Photo ${index + 1} - ${description}`}
                            loading={index === 0 ? "eager" : "lazy"}
                            decoding="async"
                            fetchPriority={index === 0 ? "high" : "low"}
                            className="w-full h-full object-contain"
                            style={{ display: "block" }}
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                            <div className="flex items-end justify-between">
                              <div>
                                <p className="text-sm font-medium text-emerald-300 mb-1">
                                  {description}
                                </p>
                                <p className="text-3xl font-bold">
                                  Photo {index + 1}
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-emerald-600 p-5 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-20"
              aria-label="Image précédente"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-emerald-600 p-5 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-20"
              aria-label="Image suivante"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            {showProgressBar && (
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800/50">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 transition-all duration-500 shadow-lg shadow-emerald-500/50"
                  style={{
                    width: `${((currentSlide + 1) / images.length) * 100}%`,
                  }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

ImageCarousel.displayName = "ImageCarousel";

export default ImageCarousel;
