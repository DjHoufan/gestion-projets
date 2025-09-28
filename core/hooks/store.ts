import {
  MapDetail,
  MemberDetail,
  Plannings,
  PurchaseDetail,
  RapportDetail,
} from "@/core/lib/types";
import { UpdatedData } from "@/core/lib/user";
import { Files, Visits } from "@prisma/client";
import { create } from "zustand";
import { persist, createJSONStorage, subscribeWithSelector } from "zustand/middleware";

type dataProps<T extends { id: string }> = {
  data: T[];
  setData: (value: T[]) => void;
  addData: (value: T) => void;
  replace: (value: T) => void;
  removeData: (id: string) => void;
  getById: (id: string) => T | undefined;
  reset: () => void;
};

const createUseItemsHook = <T extends { id: string }>() =>
  create<dataProps<T>>((set, get) => ({
    data: [],
    setData: (value: T[]) => set({ data: value }),
    addData: (value: T) => set((state) => ({ data: [...state.data, value] })),
    replace: (value: T) =>
      set((state) => ({
        data: state.data.map((item) => (item.id === value.id ? value : item)),
      })),
    removeData: (id: string) =>
      set((state) => ({
        data: state.data.filter((item) => item.id !== id),
      })),
    getById: (id: string) => get().data.find((item) => item.id === id),
    reset: () =>
      set(() => ({
        data: [],
      })),
  }));

// type OnedataProps<T extends { id: string }> = {
//   data: T | null;
//   setData: (value: T) => void;
//   reset: () => void;
// };

// const createUseItemHook = <T extends { id: string }>() =>
//   create<OnedataProps<T>>((set) => ({
//     data: null,
//     setData: (value: T) => set({ data: value }),
//     reset: () => set({ data: null }),
//   }));

type OnedataProps<T extends { id: string }> = {
  data: T | null;
  setData: (value: T) => void;
  updateField: <K extends keyof T>(key: K, value: T[K]) => void;
  updateFields: (values: Partial<T>) => void;
  reset: () => void;
};

const createUseItemHook = <T extends { id: string }>() =>
  create<OnedataProps<T>>((set) => ({
    data: null,
    setData: (value: T) => set({ data: value }),
    updateField: (key, value) =>
      set((state) =>
        state.data ? { data: { ...state.data, [key]: value } } : state
      ),
    updateFields: (values) =>
      set((state) =>
        state.data ? { data: { ...state.data, ...values } } : state
      ),
    reset: () => set({ data: null }),
  }));

export const usePurchases = createUseItemsHook<PurchaseDetail>();
export const useClasseMembers = createUseItemsHook<MemberDetail>();
export const useMedia = createUseItemsHook<Files>();
 
export const useMaps = createUseItemHook<MapDetail>();
export const useMyData = createUseItemHook<UpdatedData>();

type useTabsProps = {
  value: string;
  set: (id: string) => void;
};

export const useTabs = create<useTabsProps>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        value: "overview",
        set: (id: string) => set({ value: id }),
      }),
      {
        name: "00X4_tab",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

export const useSelectProject = create<useTabsProps>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        value: "",
        set: (id: string) => set({ value: id }),
      }),
      {
        name: "10X9_tab",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

export const useCustomeTabs = create<useTabsProps>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        value: "overview",
        set: (id: string) => set({ value: id }),
      }),
      {
        name: "10X9_tab",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

type SidebarStore = {
  value: string;
  set: (value: string) => void;
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleMobile: () => void;
};
export const useSidebar = create<SidebarStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        value: "emargement",
        set: (value: string) => set({ value }),
        isMobileOpen: false,
        setMobileOpen: (open: boolean) => set({ isMobileOpen: open }),
        toggleMobile: () => set({ isMobileOpen: !get().isMobileOpen }),
      }),
      {
        name: "01X7_tab",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

type SidebarProps = {
  value: string;
  set: (id: string) => void;
};

export const useSelectAC = create<SidebarProps>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        value: "",
        set: (id: string) => set({ value: id }),
      }),
      {
        name: "01X8_AC",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

type PlanningStore = {
  planning: Plannings | null;
  setPlanning: (planning: Plannings) => void;
  addVisit: (visits: Visits[] | Visits) => void;
  removeVisit: (visitId: string) => void;
  updateVisit: (visit: Visits) => void;
  resetPlanning: () => void;
};

export const usePlanningStore = create<PlanningStore>()(
  subscribeWithSelector((set, get) => ({
    planning: null,
    setPlanning: (planning) => set({ planning }),

    addVisit: (visits) => {
      const planning = get().planning;
      if (!planning) {
        return;
      }

      const newVisits = Array.isArray(visits) ? visits : [visits];

      set({
        planning: {
          ...planning,
          visit: [...planning.visit, ...newVisits],
        },
      });
    },

    removeVisit: (visitId) => {
      const planning = get().planning;
      if (!planning) {
        return;
      }
      set({
        planning: {
          ...planning,
          visit: planning.visit.filter((v) => v.id !== visitId),
        },
      });
    },

    updateVisit: (visit) => {
      const planning = get().planning;
      if (!planning) {
        return;
      }
      set({
        planning: {
          ...planning,
          visit: planning.visit.map((v) => (v.id === visit.id ? visit : v)),
        },
      });
    },

    resetPlanning: () => set({ planning: null }),
  }))
);

type ChatProps = {
  id: string | null;
  setChat: (value: string) => void;
};

export const useChat = create<ChatProps>()(
  subscribeWithSelector((set) => ({
    id: null,
    setChat: (value) => set({ id: value }),
  }))
);

// ✅ Sélecteurs optimisés pour éviter les re-renders
export const useTabsValue = () => useTabs((state) => state.value);
export const useTabsSet = () => useTabs((state) => state.set);

export const useSelectProjectValue = () => useSelectProject((state) => state.value);
export const useSelectProjectSet = () => useSelectProject((state) => state.set);

export const useCustomeTabsValue = () => useCustomeTabs((state) => state.value);
export const useCustomeTabsSet = () => useCustomeTabs((state) => state.set);

export const useSidebarValue = () => useSidebar((state) => state.value);
export const useSidebarSet = () => useSidebar((state) => state.set);
export const useSidebarMobile = () => useSidebar((state) => state.isMobileOpen);
export const useSidebarMobileActions = () => useSidebar((state) => ({ 
  setMobileOpen: state.setMobileOpen, 
  toggleMobile: state.toggleMobile 
}));

export const useSelectACValue = () => useSelectAC((state) => state.value);
export const useSelectACSet = () => useSelectAC((state) => state.set);

export const usePlanningData = () => usePlanningStore((state) => state.planning);
export const usePlanningActions = () => usePlanningStore((state) => ({
  setPlanning: state.setPlanning,
  addVisit: state.addVisit,
  removeVisit: state.removeVisit,
  updateVisit: state.updateVisit,
  resetPlanning: state.resetPlanning,
}));

export const useChatId = () => useChat((state) => state.id);
export const useChatActions = () => useChat((state) => ({ setChat: state.setChat }));
