"use client";

import { useMemo, useState } from "react";
import { SidebarRapport } from "@/core/view/rapports/sidebare-rapport";
import { MainContent } from "@/core/view/rapports/main-content";
import { EmargementForm } from "@/core/view/rapports/form/emargement-form";
import { VisiteTerrainForm } from "@/core/view/rapports/form/visite-terrain-form";
import { ConflitForm } from "@/core/view/rapports/form/conflit-form";
import { RencontreForm } from "@/core/view/rapports/form/rencontre-form";
import { useSidebar } from "@/core/hooks/store";
import { RapportTrainerForm } from "@/core/view/RapportTrainer/rapport-trainer-form";
import { PermissionProps } from "@/core/lib/types";
import { definePermissions } from "@/core/lib/utils";

export default function RapportBody({ permission }: PermissionProps) {
  const { canAdd, canModify, canDelete } = useMemo(() => {
    return definePermissions(permission, "rapports");
  }, [permission]);

  const [activeModal, setActiveModal] = useState<string | null>(null);

  const sidebare = useSidebar();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Left Column - Fixed Sidebar */}
      <SidebarRapport
        activeSection={sidebare.value}
        onOpenModal={setActiveModal}
      />

      {/* Right Column - Main Content with left margin */}
      <MainContent
        activeSection={sidebare.value}
        permission={{ canModify, canAdd, canDelete }}
        onOpenModalAction={setActiveModal}
      />

      {/* Modals */}
      <EmargementForm
        open={activeModal === "emargement"}
        onOpenChangeAction={(open) => !open && setActiveModal(null)}
      />
      <VisiteTerrainForm
        open={activeModal === "visite-terrain"}
        onOpenChangeAction={(open) => !open && setActiveModal(null)}
      />
      <ConflitForm
        open={activeModal === "conflit"}
        onOpenChangeAction={(open) => !open && setActiveModal(null)}
      />
      <RencontreForm
        open={activeModal === "rencontre"}
        onOpenChangeAction={(open) => !open && setActiveModal(null)}
      />
      <RapportTrainerForm
        onOpenChangeAction={(open) => !open && setActiveModal(null)}
        open={activeModal === "rapport"}
      />
    </div>
  );
}
