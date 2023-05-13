import { projects } from "@/data";
import useMainStore from "@/stores/main";
import { ProjectType } from "@/types/data";
import { FC, useRef } from "react";

interface ProjectInfoProps {}

const sources: Record<ProjectType, string> = {
  hydro: "Global Hydropower Tracker, Global Energy Monitor, May 2023 release.",
  wind: "Global Wind Power Tracker, Global Energy Monitor, January 2023 release.",
  geo: "Global Geothermal Power Tracker, Global Energy Monitor, January 2023 release.",
  solar:
    "Global Solar Power Tracker, Global Energy Monitor, January 2023 release.",
  other: "",
};

const ProjectInfo: FC<ProjectInfoProps> = ({}) => {
  const [selected] = useMainStore((state) => [state.selected]);

  const ref = useRef<HTMLDivElement>(null);

  console.log(selected);

  const project = selected ? projects[selected] : null;

  return (
    <div className="absolute left-0 top-0 m-16 bg-white p-8 space-y-4 w-128">
      {project ? (
        <>
          <h2 className="text-3xl leading-tight font-bold w-full line-clamp-3">
            {project.name}
          </h2>
          <div className="flex flex-col w-full justify-between space-x-4">
            <p className="text-xl leading-loose">* {project.time}</p>
            <p className="text-xl leading-loose">{project.power} megawatt</p>
            <p className="text-xl leading-loose">{project.type}</p>
          </div>
          <p className="text-left w-full text-md">{sources[project.type]}</p>
        </>
      ) : (
        <h2 className="text-2xl text-gray-500">no project in range</h2>
      )}
    </div>
  );
};
export default ProjectInfo;
