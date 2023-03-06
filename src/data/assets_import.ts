import { createAsset } from "use-asset";
import { shuffleArray, validateProjectType } from "../func/data";
import { Project, Scenario, Vec2D } from "../types/data";

import projectsRaw from "./raw/projects.csv";
import scenariosRaw from "./raw/scenarios.csv";
import positionsRaw from "./raw/random-positions.json";

export const positionsAsset: Vec2D[] = (() => {
  const positions = positionsRaw as Vec2D[];
  return shuffleArray(positions);
})();

export const projects: Project[] = (() => {
  const [_, ...data] = projectsRaw.split("\n").filter((line) => line.length);
  const fields = data
    .map((line) => {
      const frags = line.split(";").map((elem) => elem.trim());
      try {
        const project: Project = {
          name: frags[0],
          position: { x: parseFloat(frags[4]), y: parseFloat(frags[5]) },
          type: validateProjectType(frags[2]),
          time: parseInt(frags[3]),
          description: frags[1],
          imgSrc: frags[6],
        };
        return project;
      } catch (e) {
        throw Error(`malformed data for item: ${frags[0]}`);
      }
    })
    .filter((elem): elem is Project => elem !== undefined);

  return fields;
})();

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
        };
        return scenario;
      } catch (e) {
        throw Error(`malformed data for item: ${frags[0]}`);
      }
    })
    .filter((elem): elem is Scenario => elem !== undefined);

  return fields;
})();
