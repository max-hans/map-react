import { FC, useRef } from "react";
import useMainStore from "@/stores/main";
import { projects } from "@/data";

interface ProjectScreenProps {}

const ProjectScreen: FC<ProjectScreenProps> = () => {
  const [selected] = useMainStore((state) => [state.selected]);

  const ref = useRef<HTMLDivElement>(null);

  const project = selected ? projects[selected] : null;

  return (
    <div
      className="fixed w-screen h-screen bg-white flex flex-col justify-center items-center"
      ref={ref}
    >
      <div className="flex flex-col overflow-hidden items-center space-y-24 w-2/3">
        {project ? (
          <>
            <h2 className="text-8xl leading-tight font-bold w-full">
              {project.name}
            </h2>
            <div className="flex flex-row w-full justify-between space-x-4">
              <p className="text-6xl leading-loose">* {project.time}</p>
              <p className="text-6xl leading-loose">{project.power} megawatt</p>
              <p className="text-6xl leading-loose">{project.type}</p>
            </div>
          </>
        ) : (
          <h2 className="text-4xl text-gray-500">kein projekt ausgewählt</h2>
        )}
      </div>
    </div>
  );
};

export default ProjectScreen;
