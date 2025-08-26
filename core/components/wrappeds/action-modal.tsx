"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/core/components/ui/dialog";
import { cn } from "@/core/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { ReactNode } from "react";

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

export default ActionModal;
