import { FC, useEffect, useRef, useState } from "react";
import { Project } from "../types/data";
import useMainStore from "@/stores/main";

interface ProjectInspectorScreenProps {
  projects: Project[];
  selected: number | null;
  onDeselect: () => void;
}

const ProjectInspectorScreen: FC<ProjectInspectorScreenProps> = ({
  projects,
}) => {
  const [project, setProject] = useState<Project>();

  const [open, setOpen] = useState(false);

  const [selected, onSelect] = useMainStore((state) => [
    state.selected,
    state.onSelect,
  ]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected !== null) {
      setProject(projects[selected]);
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [selected]);

  return (
    <div
      className={`absolute bottom-0 w-1/2 left-1/4 h-1/6 bg-white p-4 flex flex-col space-y-4
	transition-all ${open ? "" : "translate-y-full"}`}
      ref={ref}
    >
      <div className="flex flex-col space-y-4 overflow-hidden">
        {project && (
          <>
            <h2 className="text-xs">{project.name}</h2>

            <p className="w-full text-xs">{project.description}</p>
            <button onClick={() => onSelect(null)}>close</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectInspectorScreen;
