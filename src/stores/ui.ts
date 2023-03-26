import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { MAX_ZOOM, MIN_ZOOM } from "../CONSTANTS";
import { constrain } from "../func/data";
import { DisplayMode, Vec2D } from "../types/data";

interface UiState {
  showFrame: boolean;
  setShowFrame: (v: boolean) => void;
  targetZoomFactor: number;
  setTargetZoomFactor: (v: number) => void;
  incrementTargetZoomFactor: (v: number) => void;
  setMove: (m: Partial<Vec2D> | null) => void;
  move: Partial<Vec2D> | null;
}

const useUiStore = create<UiState>((set, get) => ({
  showFrame: true,
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
  setMove: (move) => set({ move }),
  move: null,
}));

export default useUiStore;
