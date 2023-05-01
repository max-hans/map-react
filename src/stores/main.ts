import { projects } from "@/data";
import { create } from "zustand";
import { DisplayMode } from "../types/data";

interface MainState {
  time: number;
  setTime: (v: number) => void;
  scenario: number;
  setScenario: (v: number) => void;
  mode: DisplayMode;
  setMode: (v: DisplayMode) => void;
  selected: number | null;
  onSelect: (s: number | null) => void;
}

const useMainStore = create<MainState>((set, get) => ({
  time: 1950,
  setTime: (v) => set({ time: v }),
  scenario: 0,
  setScenario: (v) => set({ scenario: v }),
  mode: "HISTORY",
  setMode: (v) => set({ mode: v }),
  selected: null,
  onSelect: (s) => {
    if (s !== get().selected) {
      return set({ selected: s });
    }
  },
}));

export default useMainStore;
