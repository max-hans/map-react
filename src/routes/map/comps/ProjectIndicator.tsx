import { Project, Vec2D } from "@/types/data";
import ShapeView from "./ShapeView";
import { remap } from "@/func/data";
import { FC, useMemo } from "react";
import { Shape, Vector2 } from "three";
import { subVec } from "../func";

interface ProjectIndicatorProps {
  position: Vec2D;
  cursorPosition: Vec2D;
  positionCb?: (v: Vec2D) => Vec2D;
}

const INDICATOR_OFFSET = 50;

const ProjectIndicator: FC<ProjectIndicatorProps> = ({
  position,
  cursorPosition,
  positionCb = (v) => v,
}) => {
  const line: Shape | null = useMemo(() => {
    if (!position) return null;

    const target = positionCb(position);

    const newCursorPosition = {
      ...cursorPosition,
      y: cursorPosition.y - INDICATOR_OFFSET,
    };

    const delta = Math.abs(newCursorPosition.x - target.x);

    const indicatorPoint = {
      x: newCursorPosition.x,
      y: target.y - delta,
    };

    console.log(newCursorPosition);
    const positions = [
      target,
      indicatorPoint,
      {
        x: newCursorPosition.x,
        y: -10000,
      },
    ];

    console.log(positions);

    const points: Vector2[] = positions.map((pos) => {
      return new Vector2(pos.x, pos.y);
    });

    const shape = new Shape(points);
    return shape;
  }, [position, cursorPosition]);
  return line ? (
    <group renderOrder={1001} position={[0, 0, 10]}>
      <ShapeView shape={line} color="blue" thickness={0.01} />
    </group>
  ) : null;
};

export default ProjectIndicator;
