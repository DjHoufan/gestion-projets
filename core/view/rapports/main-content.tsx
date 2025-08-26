"use client";

import { Button } from "@/core/components/ui/button";

import { Plus, Download, RefreshCw, Menu } from "lucide-react";

import Emargement from "@/core/view/rapports/body/emargement";
import Conflit from "@/core/view/rapports/body/conflit";
import VisiteTerrain from "@/core/view/rapports/body/visiteTerrain";
import Rencontre from "@/core/view/rapports/body/rencontre";
import { useSidebar } from "@/core/hooks/store";

import { TrainerRapport } from "@/core/view/rapports/body/trainer-rapport";
import { CrudPermissions } from "@/core/lib/types";

interface MainContentProps {
  activeSection: string;
  onOpenModalAction: (modalId: string) => void;
  permission: CrudPermissions;
}

const sectionConfig = {
  emargement: {
    title: "Gestion des Émargements",
    description: "Suivi des signatures et validations des documents",
    color: "blue",
  },
  "visite-terrain": {
    title: "Gestion des Visites Terrain",
    description: "Suivi des inspections et visites sur le terrain",
    color: "orange",
  },
  conflit: {
    title: "Gestion des Conflits",
    description: "Résolution et suivi des différends",
    color: "red",
  },
  rencontre: {
    title: "Gestion des Rencontres",
    description: "Organisation et suivi des réunions",
    color: "purple",
  },
  rapport: {
    title: "Gestion des rapports des formateurs",
    description:
      "Accéder aux rapports soumis par les formateurs et assurer leur gestion",
    color: "cyan",
  },
};

export function MainContent({
  activeSection,
  onOpenModalAction,
  permission,
}: MainContentProps) {
  const { canAdd } = permission;
  const config = sectionConfig[activeSection as keyof typeof sectionConfig];
  const sidebare = useSidebar();

  const renderTable = () => {
    switch (activeSection) {
      case "emargement":
        return <Emargement permission={permission} />;

      case "visite-terrain":
        return <VisiteTerrain permission={permission}  />;
      case "conflit":
        return <Conflit  permission={permission}  />;

      case "rencontre":
        return <Rencontre permission={permission} />;
      case "rapport":
        return <TrainerRapport  />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 bg-slate-50/50 md:ml-80 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <div className="flex items-center md:flex-row  gap-5 flex-col-reverse justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {config?.title}
              </h1>
              <p className="text-slate-600 mt-1">{config?.description}</p>
            </div>
            <div className="flex items-center justify-between w-full md:w-auto gap-3">
              {canAdd && (
                <Button
                  onClick={() => onOpenModalAction(activeSection)}
                  className="bg-gradient-to-r from-teal-500 to-emerald-600 !px-10 !rounded"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="md:hidden bg-transparent"
                onClick={() => sidebare.toggleMobile()}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {renderTable()}
      </div>
    </div>
  );
}
