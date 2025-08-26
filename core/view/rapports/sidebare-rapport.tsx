"use client";

import { Button } from "@/core/components/ui/button";
 
import {
  PenTool,
  MapPin,
  AlertTriangle,
  Calendar,
  FileText,
  X,
} from "lucide-react";
import { TbReportAnalytics } from "react-icons/tb";
import { useSidebar } from "@/core/hooks/store";
import { useEffect } from "react";

interface SidebarProps {
  activeSection: string;
  onOpenModal: (modalId: string) => void;
}

const menuItems = [
  {
    id: "emargement",
    title: "Émargement",
    description: "Gestion des signatures",
    icon: PenTool,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    hoverColor: "hover:bg-blue-100",
  },
  {
    id: "visite-terrain",
    title: "Visite Terrain",
    description: "Visites sur le terrain",
    icon: MapPin,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    hoverColor: "hover:bg-orange-100",
  },
  {
    id: "conflit",
    title: "Conflits",
    description: "Gestion des conflits",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    hoverColor: "hover:bg-red-100",
  },
  {
    id: "rencontre",
    title: "Rencontres",
    description: "Organisation des réunions",
    icon: Calendar,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    hoverColor: "hover:bg-purple-100",
  }, {
    id: "rapport",
    title: "Rapport",
    description: "Rapport des formateurs",
    icon: TbReportAnalytics,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    hoverColor: "hover:bg-cyan-100",
  },
];

export function SidebarRapport({ activeSection }: SidebarProps) {
  const sidebare = useSidebar();

  // Fermer la sidebar mobile quand on change de section
  const handleSectionChange = (sectionId: string) => {
    sidebare.set(sectionId);
    // Fermer la sidebar sur mobile après sélection
    if (window.innerWidth < 768) {
      sidebare.setMobileOpen(false);
    }
  };

  // Empêcher le scroll du body quand la sidebar mobile est ouverte
  useEffect(() => {
    if (sidebare.isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebare.isMobileOpen]);

  return (
    <>
      {/* Backdrop pour mobile */}
      {sidebare.isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50  md:hidden"
          onClick={() => sidebare.setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed h-screen w-80 bg-white border-r border-slate-200 flex flex-col z-10 transition-transform duration-300 ease-in-out
        ${sidebare.isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-lg">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Gestion des rapports
                </h1>
                <p className="text-sm text-slate-600">
                  Formulaires et documents
                </p>
              </div>
            </div>
            {/* Bouton fermer pour mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => sidebare.setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              les différents rapports
            </h2>
          </div>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => handleSectionChange(item.id)}
                className={`
                  w-full p-4 h-auto justify-start rounded-xl transition-all duration-200
                  ${
                    isActive
                      ? `${item.bgColor} ${item.color} shadow-sm border border-current/20`
                      : `text-slate-700 ${item.hoverColor}`
                  }
                `}
              >
                <div className="flex items-center gap-3 w-full">
                  <div
                    className={`
                    p-2 rounded-lg transition-colors
                    ${isActive ? "bg-white/80" : "bg-slate-100"}
                  `}
                  >
                    <IconComponent
                      className={`h-5 w-5 ${
                        isActive ? item.color : "text-slate-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-sm">{item.title}</div>
                    <div
                      className={`text-xs ${
                        isActive ? "opacity-80" : "text-slate-500"
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                  
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
}
