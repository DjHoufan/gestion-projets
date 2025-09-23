"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/core/components/ui/dialog";
import { cn } from "@/core/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { ReactNode } from "react";
import { memoizeComponent } from "@/core/lib/component-optimization";

interface ActionModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  z: "!z-[999]" | "z-[50]";
  size:
    | "md:max-w-[900px]"
    | "md:max-w-[1000px]"
    | "md:max-w-[400px]"
    | "md:max-w-[600px]"
    | "md:max-w-[700px]"
    | "md:max-w-3xl"
    | "w-full";
  title?: string; // Optional title prop
}

// ✅ ActionModal optimisé avec React.memo (nom original conservé)
const ActionModal = ({
  open,
  onClose,
  children,
  size,
  z,
  title = "Dialog",
}: ActionModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={cn(`p-5 w-full ${z}`, size)}>
        <DialogTitle asChild>
          <VisuallyHidden>{title}</VisuallyHidden>
        </DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
};

// ✅ Export du composant mémorisé avec nom original
export default memoizeComponent(ActionModal, (prevProps, nextProps) => {
  // ✅ Comparaison personnalisée pour éviter les re-renders
  return (
    prevProps.open === nextProps.open &&
    prevProps.onClose === nextProps.onClose &&
    prevProps.children === nextProps.children &&
    prevProps.size === nextProps.size &&
    prevProps.z === nextProps.z &&
    prevProps.title === nextProps.title
  );
});
