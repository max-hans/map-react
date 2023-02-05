import { FC, useState } from "react";
import { Project } from "../types/data";

export interface ProjectInspectorProps {
  open: boolean;
  projects: Project[];
  selected: number;
  onDeselect: () => void;
}

const ProjectInspector: FC<ProjectInspectorProps> = ({
  open,
  projects,
  selected,
  onDeselect,
}) => {
  const project = projects[selected];

  return (
    <div
      className={`fixed top-16 bg-white p-4 flex flex-col space-y-4 rounded-md shadow-md w-72 z-50
	transition-all right-0 ${open ? "" : "translate-x-72"}`}
    >
      <div
        className="flex flex-col space-y-4 overflow-hidden"
        style={{ display: open ? "visible" : "hidden" }}
      >
        {project && (
          <>
            <h2 className="text-xl">{project.name}</h2>
            <img src={`/projects/${project.imgSrc}`} alt={project.name} />
            <p className="w-full">{project.description}</p>
            <button onClick={onDeselect}>close</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectInspector;

{
  /* <script lang="ts">
	import type { Project } from '$lib/types/data';

	export let projects: Project[];
	export let selected: number | null;
	let project: Project | undefined;

	let open = false;

	$: if (selected !== null) {
		project = projects[selected];
		open = true;
	} else {
		project = undefined;
		open = false;
	}
</script>
 */
}
