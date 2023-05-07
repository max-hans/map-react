import { remap, validateProjectType } from "../func/data";
import { Project, Scenario, SimpleProject } from "../types/data";

import futureProjectsRaw from "./raw/future-projects.csv?raw";
import historicProjectsSimple from "./raw/history-projects.csv?raw";

import scenariosRaw from "./raw/scenarios.csv?raw";
import { nanoid } from "nanoid";

const extractProjectsFromCSV = (input: string): Project[] => {
  const [_, ...data] = input.split("\n").filter((line) => line.length);

  const fields = data
    .map((line, i) => {
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
        console.log(`malformed data for item: ${i} ${line}`);
        throw Error(`malformed data for item: ${line}`);
      }
    })
    .filter((elem): elem is Project => elem !== undefined);
  return fields;
};

export const allProjects: Project[] = extractProjectsFromCSV(
  historicProjectsSimple
).sort((a, b) => b.power - a.power);

const PROJECTS_COUNT = 1000;
const SIMPLE_PROJECTS_COUNT = 5000;

export const projects: Project[] = allProjects.slice(0, PROJECTS_COUNT);

export const futureProjects: Project[] =
  extractProjectsFromCSV(futureProjectsRaw);

const MIN_CAP = 25;

export const simpleProjects: SimpleProject[] = allProjects
  .slice(PROJECTS_COUNT + 1, PROJECTS_COUNT + SIMPLE_PROJECTS_COUNT)
  .map((elem) => ({
    time: elem.time,
    position: elem.position,
    id: nanoid(),
    power: elem.power,
  }));

export const scenarios: Scenario[] = (() => {
  const [_, ...data] = scenariosRaw.split("\n").filter((line) => line.length);
  const fields = data
    .map((line) => {
      const frags = line.split(";").map((elem) => elem.trim());
      try {
        const scenario: Scenario = {
          data: frags[1],
          projects: parseFloat(frags[2]),
          name: frags[3],
          idx: parseInt(frags[0]),
          temperature: parseFloat(frags[4]),
        };
        return scenario;
      } catch (e) {
        throw Error(`malformed data for item: ${line.length}`);
      }
    })
    .filter((elem): elem is Scenario => elem !== undefined);

  return fields;
})();
