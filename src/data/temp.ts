import { Scenario } from "@/types/data";
import { scenarios } from ".";
import temps from "./raw/temps.json";

export const getTemperatureForYear = (year: number): number => {
  return temps.find((elem) => elem.Year === Math.floor(year))?.Mean ?? 0;
};

export const getTemperatureForScenario = (scenario: number): number => {
  return scenarios[scenario]?.temperature ?? -1;
};

export const getScenario = (scenario: number): Scenario => {
  return scenarios[scenario];
};
