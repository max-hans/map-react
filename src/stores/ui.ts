import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { MAX_ZOOM, MIN_ZOOM } from "../CONSTANTS";
import { constrain } from "../func/data";
import { DisplayMode } from "../types/data";

interface UiState {
  showFrame: boolean;
  setShowFrame: (v: boolean) => void;
  targetZoomFactor: number;
  setTargetZoomFactor: (v: number) => void;
  incrementTargetZoomFactor: (v: number) => void;
}

const useUiStore = create<UiState>((set, get) => ({
  showFrame: false,
  setShowFrame: (showFrame) => set({ showFrame }),
  targetZoomFactor: 1,
  setTargetZoomFactor: (v) => set({ targetZoomFactor: v }),
  incrementTargetZoomFactor: (v) =>
    set({
      targetZoomFactor: constrain(
        get().targetZoomFactor + v,
        MIN_ZOOM,
        MAX_ZOOM
      ),
    }),
}));

export default useUiStore;
