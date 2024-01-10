import { remap, shuffleArray, validateProjectType } from "../func/data";
import { Project, Scenario, SimpleProject } from "../types/data";

import futureProjectsRaw from "./raw/future-projects.csv?raw";
import historicProjectsRaw from "./raw/history-projects.csv?raw";
import historicProjectsSimpleRaw from "./raw/history-projects.csv?raw";

import scenariosRaw from "./raw/scenarios.csv?raw";
import { nanoid } from "nanoid";

const extractFloat = (s: string) => parseFloat(s.replaceAll(",", "."));

const extractProjectsFromCSV = (input: string): Project[] => {
  const [_, ...data] = input.split("\n").filter((line) => line.length);

  const fields = data
    .map((line, i) => {
      const frags = line.split(";").map((elem) => elem.trim());
      try {
        const project: Project = {
          name: frags[0],
          position: {
            x: remap(extractFloat(frags[5]), -180, 180, 0, 1),
            y: remap(extractFloat(frags[4]), 90, -90, 0, 1),
          },
          type: validateProjectType(frags[2]),
          time: parseInt(frags[3]),
          imgSrc: frags[6],
          power: extractFloat(frags[1]),
          description: "",
        };

        return project;
      } catch (e) {
        console.log(`malformed data for item: ${i} ${line}`);
        throw Error(`malformed data for item: ${line}`);
      }
    })
    .filter((elem): elem is Project => elem !== undefined);

  return fields;
};

export const projects: Project[] = extractProjectsFromCSV(historicProjectsRaw);

export const simpleProjects: SimpleProject[] = extractProjectsFromCSV(
  historicProjectsSimpleRaw
).map((elem) => ({
  time: elem.time,
  position: elem.position,
  id: nanoid(),
  power: elem.power,
}));

export const futureProjects: Project[] =
  extractProjectsFromCSV(futureProjectsRaw);

const noYearLength = (arr: Array<SimpleProject | Project>) => {
  return arr.filter((elem) => isNaN(elem.time));
};

console.log("noYearFuture", noYearLength(futureProjects));
console.log("noYearHistory", noYearLength(projects));
console.log("noYearSimple", noYearLength(simpleProjects));

export const shuffledFutureProjects = shuffleArray(futureProjects);

export const scenarios: Scenario[] = (() => {
  const [_, ...data] = scenariosRaw
    .split("\n")
    .filter((line: string) => line.length);
  const fields = data
    .map((line: string) => {
      const frags = line.split(";").map((elem) => elem.trim());
      try {
        const scenario: Scenario = {
          data: frags[1],
          projects: extractFloat(frags[2]),
          name: frags[3],
          idx: parseInt(frags[0]),
          temperature: extractFloat(frags[5]),
        };
        return scenario;
      } catch (e) {
        throw Error(`malformed data for item: ${line.length}`);
      }
    })
    .filter((elem): elem is Scenario => elem !== undefined);

  return fields;
})();
