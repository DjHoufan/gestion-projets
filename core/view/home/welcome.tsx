"use client";
import { Sparkles } from "lucide-react";

export const Welcome = () => {
  return (
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
                Piloter l'accompagnement des jeunes bénéficiaires avec des
                outils avancés et en temps réel
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
