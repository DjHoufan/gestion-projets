"use client";

import { useModal } from "@/core/providers/modal-provider";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import ActionModal from "./action-modal";

type Props = {
  title?: string;
  subheading?: string;
  children: React.ReactNode;
  z?: "!z-[999]" | "z-[50]";

  x?: boolean;
  size?:
    | "md:max-w-3xl"
    | "md:max-w-[900px]"
    | "md:max-w-[400px]"
    | "md:max-w-[600px]"
    | "md:max-w-[700px]"
    | "md:max-w-[1000px]";
};

const CustomModal = ({
  children,
  subheading,
  title,
  size = "md:max-w-[900px]",
  z = "z-[50]",
}: Props) => {
  const { isOpen, close } = useModal();
  return (
    <ActionModal z={z} open={isOpen} onClose={close} size={size}>
      <div className=" text-left  space-y-7">
        {title && <div className="text-2xl font-bold text-black">{title}</div>}
        {subheading && (
          <div className="text-base text-muted-foreground">{subheading}</div>
        )}

        <ScrollArea className={`md:max-h-[700px] ${size} p-5`}>
          {children}
        </ScrollArea>
      </div>
    </ActionModal>
  );
};

export default CustomModal;
