export interface Scenario {
  idx: number;
  name: string;
  data: string;
  projects: number;
  temperature: number;
}

export interface History {
  src: string;
}

export interface Vec2D {
  x: number;
  y: number;
}

export const ProjectTypes = ["wind", "solar", "hydro", "other", "geo"] as const;

export type ProjectType = (typeof ProjectTypes)[number];

export interface Project {
  position: Vec2D;
  type: ProjectType;
  time: number;
  name: string;
  description: string;
  imgSrc: string;
  power: number;
}

export interface SimpleProject {
  position: Vec2D;
  time: number;
  id: string;
}

export type DisplayMode = "HISTORY" | "FUTURE";

export interface History {
  src: string;
  from: number;
  to: number;
}
