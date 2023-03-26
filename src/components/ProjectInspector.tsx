import { FC, useEffect, useRef, useState } from "react";
import { Project } from "../types/data";
import { useClickAway } from "react-use";
import useMainStore from "@/stores/main";

export interface ProjectInspectorProps {
  projects: Project[];
  selected: number | null;
  onDeselect: () => void;
}

const ProjectInspector: FC<ProjectInspectorProps> = ({ projects }) => {
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
      className={`fixed top-16 bg-white p-4 flex flex-col space-y-4 rounded-md shadow-md w-72 z-50
	transition-all left-0 ${open ? "" : "-translate-x-72"}`}
      ref={ref}
    >
      <div className="flex flex-col space-y-4 overflow-hidden">
        {project && (
          <>
            <h2 className="text-xl">{project.name}</h2>
            <img src={`/projects/${project.imgSrc}`} alt={project.name} />
            <p className="w-full">{project.description}</p>
            <button onClick={() => onSelect(null)}>close</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectInspector;
