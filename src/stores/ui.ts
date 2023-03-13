import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { DisplayMode } from "../types/data";

interface UiState {
  targetZoomFactor: number;
  setTargetZoomFactor: (v: number) => void;
}

const useUiStore = create<UiState>((set) => ({
  targetZoomFactor: 1,
  setTargetZoomFactor: (v) => set({ targetZoomFactor: v }),
}));

export default useUiStore;
