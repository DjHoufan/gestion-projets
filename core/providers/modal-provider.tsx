"use client";
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type FC,
} from "react";

type ModalContextType = {
  isOpen: boolean;
  open: (modal: ReactNode) => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ReactNode | null>(null);

  const open = (modal: ReactNode) => setContent(modal);
  const close = () => setContent(null);

  return (
    <ModalContext.Provider value={{ isOpen: !!content, open, close }}>
      {children}
      {content}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context)
    throw new Error("useModal must be used within a ModalProvider");
  return context;
};
