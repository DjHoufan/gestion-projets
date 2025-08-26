"use client";
import {
  GanttCreateMarkerTrigger,
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttHeader,
  GanttMarker,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
  type GanttFeature, // Import the type for clarity
} from "@/core/components/ui/gantt";
import { EyeIcon, LinkIcon, TrashIcon } from "lucide-react";
import { useMemo, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/core/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import { ProjectDetail } from "@/core/lib/types";

// // Vos données fournies
// const rawData = [
//   {
//     id: "a0374024-8363-4fb7-9f27-fa658f7cb13b",
//     name: "test 2",
//     status: false,
//     startDate: "2025-05-12T11:47:55.740Z",
//     endDate: "2025-08-22T11:47:55.740Z",
//   },
//   {
//     id: "2a0fc2a6-d792-490e-b2e4-a78fcd9f3367",
//     name: "test 4",
//     status: false,
//     startDate: "2025-07-14T11:49:25.164Z",
//     endDate: "2025-10-09T11:49:25.164Z",
//   },
//   {
//     id: "622b1d0e-9ec7-4de2-9548-2ec3496680a5",
//     name: "test 3",
//     status: false,
//     startDate: "2025-09-25T11:49:25.164Z",
//     endDate: "2025-10-25T11:49:25.164Z",
//   },
// ];

// Définir les statuts avec les couleurs émeraude et orange
const statuses = [
  { id: "planned", name: "Planifié", color: "#F97316" }, // Orange-500 pour planifié/false
  { id: "done", name: "Terminé", color: "#10B981" }, // Émeraude-500 pour terminé/true
];

// Transformer rawData au format GanttFeature

const exampleMarkers = [
  {
    id: "marker-1",
    date: new Date("2025-06-15"),
    label: "Jalon 1",
    className: "bg-emerald-100 text-emerald-900",
  },
  {
    id: "marker-2",
    date: new Date("2025-09-01"),
    label: "Point de révision",
    className: "bg-orange-100 text-orange-900",
  },
];

export const GranttView = ({ projects }: { projects: ProjectDetail[] }) => {
  const initialFeatures = useMemo<GanttFeature[]>(() => {
    return projects.map((item) => ({
      id: item.id,
      name: item.name,
      startAt: new Date(item.startDate),
      endAt: new Date(item.endDate),
      status: item.status ? statuses[1] : statuses[0],
    }));
  }, [projects, statuses]);

  const [features, setFeatures] = useState(initialFeatures);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<GanttFeature | null>(
    null
  );

  const handleViewFeature = (id: string) => {
    const feature = features.find((f) => f.id === id);
    if (feature) {
      setSelectedFeature(feature);
      setIsModalOpen(true);
    }
  };

  const handleRemoveFeature = (id: string) =>
    setFeatures((prev) => prev.filter((feature) => feature.id !== id));

  const handleMoveFeature = (id: string, startAt: Date, endAt: Date | null) => {
    if (!endAt) {
      return;
    }
    setFeatures((prev) =>
      prev.map((feature) =>
        feature.id === id ? { ...feature, startAt, endAt } : feature
      )
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 p-4">
        <GanttProvider
          className="border rounded-lg overflow-hidden shadow-lg"
          range="monthly"
          zoom={100}
        >
          <GanttSidebar>
            <GanttSidebarGroup key="all-features" name="Tous les projets">
              {features.map((feature) => (
                <GanttSidebarItem feature={feature} key={feature.id} />
              ))}
            </GanttSidebarGroup>
          </GanttSidebar>
          <GanttTimeline>
            <GanttHeader />
            <GanttFeatureList>
              <GanttFeatureListGroup key="all-features-list">
                {features.map((feature) => (
                  <div className="flex" key={feature.id}>
                    <ContextMenu>
                      <ContextMenuTrigger asChild>
                        <button
                          onClick={() => handleViewFeature(feature.id)}
                          type="button"
                        >
                          <GanttFeatureItem
                            onMove={handleMoveFeature}
                            {...feature}
                          >
                            <p className="flex-1 truncate text-xs">
                              {feature.name}
                            </p>
                          </GanttFeatureItem>
                        </button>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem
                          className="flex items-center gap-2"
                          onClick={() => handleViewFeature(feature.id)}
                        >
                          <EyeIcon
                            className="text-muted-foreground"
                            size={16}
                          />
                          Voir le projet
                        </ContextMenuItem>
                        <ContextMenuItem className="flex items-center gap-2">
                          <LinkIcon
                            className="text-muted-foreground"
                            size={16}
                          />
                          Copier le lien
                        </ContextMenuItem>
                        <ContextMenuItem
                          className="flex items-center gap-2 text-destructive"
                          onClick={() => handleRemoveFeature(feature.id)}
                        >
                          <TrashIcon size={16} />
                          Retirer de la feuille de route
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </div>
                ))}
              </GanttFeatureListGroup>
            </GanttFeatureList>
            {exampleMarkers.map((marker) => (
              <GanttMarker key={marker.id} {...marker} />
            ))}
            <GanttToday />
            <GanttCreateMarkerTrigger onCreateMarker={() => {}} />
          </GanttTimeline>
        </GanttProvider>
        {selectedFeature && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  Détails du Projet : {selectedFeature.name}
                </DialogTitle>
                <DialogDescription>
                  Voici les informations détaillées pour le projet sélectionné.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-right text-sm font-medium">Nom:</span>
                  <span className="col-span-3 text-sm">
                    {selectedFeature.name}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-right text-sm font-medium">Début:</span>
                  <span className="col-span-3 text-sm">
                    {selectedFeature.startAt.toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-right text-sm font-medium">Fin:</span>
                  <span className="col-span-3 text-sm">
                    {selectedFeature.endAt.toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-right text-sm font-medium">
                    Statut:
                  </span>
                  <span
                    className="col-span-3 text-sm"
                    style={{ color: selectedFeature.status.color }}
                  >
                    {selectedFeature.status.name}
                  </span>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
};
