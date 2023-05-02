import { ProjectType, ProjectTypes } from "../types/data";

export const remap = (
  value: number,
  low1: number,
  high1: number,
  low2: number,
  high2: number,
  doConstrain = false
): number => {
  const val = low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
  return doConstrain ? constrain(val, low2, high2) : val;
};

export const validateProjectType = (t: string) => {
  const transformed = t.toLowerCase();
  if ((ProjectTypes as unknown as string[]).includes(transformed)) {
    return transformed as ProjectType;
  } else {
    throw "not a valid projecttype";
  }
};

export function shuffleArray<T>(arr: T[]) {
  return arr.sort(function () {
    return Math.random() - 0.5;
  });
}

export const constrain = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(val, min));

export const withinBounds = (
  val: number,
  min: number,
  max: number
): boolean => {
  return val >= min && val <= max;
};
