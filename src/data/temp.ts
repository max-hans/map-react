import temps from "./raw/temps.json";

export const getTemperatureForYear = (year: number): number => {
  return temps.find((elem) => elem.Year === year)?.Mean ?? 0;
};
