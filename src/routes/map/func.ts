import { Vec2D } from "../../types/data";

export const addVec = (a: Vec2D, b: Vec2D) => {
  return { x: a.x + b.x, y: b.y + a.y };
};

export const subVec = (a: Vec2D, b: Vec2D) => {
  return { x: a.x - b.x, y: a.y - b.y };
};
