import { remap, validateProjectType } from "../func/data";
import { Project, Scenario } from "../types/data";

import projectsRaw from "./raw/projects.csv?raw";
import futureProjectsRaw from "./raw/future-projects.csv?raw";
import scenariosRaw from "./raw/scenarios.csv?raw";

const extractProjectsFromCSV = (input: string): Project[] => {
  const [_, ...data] = input.split("\n").filter((line) => line.length);

  const fields = data
    .map((line) => {
      const frags = line.split(";").map((elem) => elem.trim());
      try {
        const project: Project = {
          name: frags[0],
          position: {
            x: remap(parseFloat(frags[5]), -180, 180, 0, 1),
            y: remap(parseFloat(frags[4]), 90, -90, 0, 1),
          },
          type: validateProjectType(frags[2]),
          time: parseInt(frags[3]),
          imgSrc: frags[6],
          power: parseFloat(frags[1]),
          description: "",
        };
        return project;
      } catch (e) {
        console.log(e);
        throw Error(`malformed data for item: ${frags[0]}`);
      }
    })
    .filter((elem): elem is Project => elem !== undefined);
  console.log(fields);
  return fields;
};

export const projects: Project[] = extractProjectsFromCSV(projectsRaw);
export const futureProjects: Project[] =
  extractProjectsFromCSV(futureProjectsRaw);

export const scenarios: Scenario[] = (() => {
  const [_, ...data] = scenariosRaw.split("\n").filter((line) => line.length);
  const fields = data
    .map((line) => {
      const frags = line.split(";").map((elem) => elem.trim());
      try {
        const scenario: Scenario = {
          data: frags[1],
          projects: parseFloat(frags[2]),
          idx: parseInt(frags[0]),
          temperature: parseFloat(frags[3]),
        };
        return scenario;
      } catch (e) {
        throw Error(`malformed data for item: ${frags[0]}`);
      }
    })
    .filter((elem): elem is Scenario => elem !== undefined);

  return fields;
})();
