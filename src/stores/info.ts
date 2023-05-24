import { create } from "zustand";
import { Project } from "../types/data";

interface InfoState {
  selectedProject: Project | null;
  setSelectedProject: (p: Project | null) => void;
}

const useInfoStore = create<InfoState>((set) => ({
  selectedProject: null,
  setSelectedProject: (p) => set({ selectedProject: p }),
}));

export default useInfoStore;
