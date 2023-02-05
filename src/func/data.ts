import { ProjectType, ProjectTypes } from "../types/data";

export const remap = (
  value: number,
  low1: number,
  high1: number,
  low2: number,
  high2: number
): number => {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
};

export const validateProjectType = (t: string) => {
  const transformed = t.toLowerCase();
  if ((ProjectTypes as unknown as string[]).includes(transformed)) {
    return transformed as ProjectType;
  } else {
    throw "not a valid projecttype";
  }
};
