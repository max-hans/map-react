import { remap, shuffleArray, validateProjectType } from "../func/data";
import { Project, Scenario, SimpleProject } from "../types/data";

import futureProjectsRaw from "../../raw/future-projects.csv?raw";
import historicProjectsRaw from "../../raw/history-projects.csv?raw";
import historicProjectsSimple from "../../raw/history-projects-simple.csv?raw";

import scenariosRaw from "../../raw/scenarios.csv?raw";
import { nanoid } from "nanoid";

const extractFloat = (s: string) => parseFloat(s.replaceAll(",", "."));

const extractProjectsFromCSV = (input: string): Project[] => {
  const [_, ...data] = input.split("\n").filter((line) => line.length);

  const fields = data.reduce<{
    success: Project[];
    failed: { content: string; lineNum: number }[];
  }>(
    (acc, line, i) => {
      const frags = line.split(",").map((elem) => elem.trim());
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
          power: parseFloat(frags[1]),
          description: "",
        };
        /* return project; */
        return { ...acc, success: [...acc.success, project] };
      } catch (e) {
        return {
          ...acc,
          failed: [...acc.failed, { content: line, lineNum: i + 1 }],
        };
      }
    },
    { success: [], failed: [] }
  );
  console.log("items failed:", fields.failed);

  fields.success.forEach((elem) => console.log(elem.time));

  return fields.success;
};

export const projects: Project[] = extractProjectsFromCSV(historicProjectsRaw);

export const simpleProjects: SimpleProject[] = extractProjectsFromCSV(
  historicProjectsSimple
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

console.log("Future", futureProjects.length);
console.log("History", projects.length);
console.log("HistorySimple", simpleProjects.length);

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
