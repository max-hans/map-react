import { createAsset } from "use-asset";
import { validateProjectType } from "../func/data";
import { Project, Scenario, Vec2D } from "../types/data";

export const positionsAsset = createAsset(
  async (shuffle = false): Promise<Vec2D[]> => {
    const res = (await (
      await fetch("/data/random-positions.json")
    ).json()) as Vec2D[];

    if (shuffle) {
      return res.sort(() => Math.random() - 0.5);
    }
    return res;
  }
);

export const projectsAsset = createAsset(async () => {
  const res = await (await fetch("/data/projects.csv")).text();

  const [_, ...data] = res.split("\n").filter((line) => line.length);
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
});

export const scenariosAsset = createAsset(async (): Promise<Scenario[]> => {
  const res = await (await fetch("/data/scenarios.csv")).text();

  const [_, ...data] = res.split("\n").filter((line) => line.length);
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
});
