import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { DisplayMode } from "../types/data";

interface MainState {
  time: number;
  setTime: (v: number) => void;
  scenario: number;
  setScenario: (v: number) => void;
  mode: DisplayMode;
  setMode: (v: DisplayMode) => void;
}

const useMainStore = create<MainState>((set) => ({
  time: 1950,
  setTime: (v) => set({ time: v, mode: "HISTORY" }),
  scenario: 0,
  setScenario: (v) => set({ scenario: v, mode: "FUTURE" }),
  mode: "HISTORY",
  setMode: (v) => set({ mode: v }),
}));

export default useMainStore;
