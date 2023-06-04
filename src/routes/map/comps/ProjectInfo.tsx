import useInfoStore from "@/stores/info";
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
  const selectedProject = useInfoStore((state) => state.selectedProject);

  const ref = useRef<HTMLDivElement>(null);

  /*   const project = selected ? projects[selected] : null; */

  return (
    <div className="absolute left-0 top-0 m-16 bg-white p-16 space-y-4 w-1/3">
      {selectedProject ? (
        <>
          <h2 className="text-3xl leading-tight font-bold w-full underline decoration-blue-600">
            {selectedProject.name}
          </h2>
          <div className="flex flex-col w-full justify-between space-x-4">
            <p className="text-xl leading-loose">
              *{" "}
              {selectedProject.time === 2100 ? "future" : selectedProject.time}
            </p>
            <p className="text-xl leading-loose">
              {selectedProject.power} megawatt
            </p>
            <p className="text-xl leading-loose">{selectedProject.type}</p>
          </div>
          <p className="text-left w-full text-md">
            {sources[selectedProject.type]}
          </p>
        </>
      ) : (
        <h2 className="text-2xl text-gray-500">no project in range</h2>
      )}
    </div>
  );
};
export default ProjectInfo;
