import { FC, useEffect, useRef, useState } from "react";
import useMainStore from "@/stores/main";
import { Project } from "@/types/data";
import { projects } from "@/data";

interface ProjectScreenProps {}

const ProjectScreen: FC<ProjectScreenProps> = () => {
  const [project, setProject] = useState<Project>();

  const [open, setOpen] = useState(false);

  /* const [selected] = useMainStore((state) => [state.selected]); */

  const selected = 1;
  console.log(selected);

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
      className="fixed w-screen h-screen bg-white flex flex-col justify-center items-center"
      ref={ref}
    >
      <div className="flex flex-col overflow-hidden items-center space-y-8 max-w-4xl">
        {project && (
          <>
            <h2 className="text-8xl font-bold">{project.name}</h2>
            <p className="w-full text-4xl">{project.type}</p>
            <p className="w-full text-4xl">built in {project.time}</p>
            <p className="w-full text-4xl">{project.power} MW</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectScreen;
