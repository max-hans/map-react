export interface Scenario {
  idx: number;
  data: string;
  projects: number;
}

export interface DisplayScenario extends Scenario {
  opacity: number;
}

export interface History {
  src: string;
}

export interface Vec2D {
  x: number;
  y: number;
}

export const ProjectTypes = ["wind", "solar", "hydro", "other"] as const;

export type ProjectType = typeof ProjectTypes[number];

export interface Project {
  position: Vec2D;
  type: ProjectType;
  time: number;
  name: string;
  description: string;
  imgSrc: string;
}

export type DisplayMode = "HISTORY" | "FUTURE";

export interface History {
  src: string;
  from: number;
  to: number;
}

export interface TimeDef {
  month: number;
  year: number;
}
