"use client";
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
  type FC,
} from "react";

// ✅ Séparer les actions du state
type ModalActionsType = {
  open: (modal: ReactNode) => void;
  close: () => void;
};

type ModalStateType = {
  isOpen: boolean;
  content: ReactNode | null;
};

const ModalActionsContext = createContext<ModalActionsType | undefined>(undefined);
const ModalStateContext = createContext<ModalStateType | undefined>(undefined);

export const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ReactNode | null>(null);

  // ✅ Actions mémorisées (ne changent jamais)
  const actions = useMemo(
    () => ({
      open: (modal: ReactNode) => setContent(modal),
      close: () => setContent(null),
    }),
    []
  );

  // ✅ State mémorisé
  const state = useMemo(
    () => ({
      isOpen: !!content,
      content,
    }),
    [content]
  );

  return (
    <ModalActionsContext.Provider value={actions}>
      <ModalStateContext.Provider value={state}>
        {children}
        {content && (
          <div className="modal-overlay">
            {content}
          </div>
        )}
      </ModalStateContext.Provider>
    </ModalActionsContext.Provider>
  );
};

// ✅ Hooks séparés pour optimiser les re-renders
export const useModalActions = (): ModalActionsType => {
  const context = useContext(ModalActionsContext);
  if (!context)
    throw new Error("useModalActions must be used within a ModalProvider");
  return context;
};

export const useModalState = (): ModalStateType => {
  const context = useContext(ModalStateContext);
  if (!context)
    throw new Error("useModalState must be used within a ModalProvider");
  return context;
};

// ✅ Hook combiné pour compatibilité
export const useModal = () => {
  const actions = useModalActions();
  const { isOpen } = useModalState();
  return { ...actions, isOpen };
};