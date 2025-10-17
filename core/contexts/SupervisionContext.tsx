"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SupervisionContextType {
  selectedAccompanist: any | null;
  setSelectedAccompanist: (accompanist: any | null) => void;
}

const SupervisionContext = createContext<SupervisionContextType | undefined>(undefined);

export function SupervisionProvider({ children }: { children: ReactNode }) {
  const [selectedAccompanist, setSelectedAccompanist] = useState<any | null>(null);

  return (
    <SupervisionContext.Provider value={{ selectedAccompanist, setSelectedAccompanist }}>
      {children}
    </SupervisionContext.Provider>
  );
}

export function useSupervision() {
  const context = useContext(SupervisionContext);
  if (context === undefined) {
    throw new Error("useSupervision must be used within a SupervisionProvider");
  }
  return context;
}
