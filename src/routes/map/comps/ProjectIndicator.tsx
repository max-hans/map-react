import { Project, Vec2D } from "@/types/data";
import ShapeView from "./ShapeView";
import { remap } from "@/func/data";
import { FC, useMemo } from "react";
import { Shape, Vector2 } from "three";
import { subVec } from "../func";

interface ProjectIndicatorProps {
  position: Vec2D;
  positionCb?: (v: Vec2D) => Vec2D;
}

const INDICATOR_OFFSET = 0.03;

const ProjectIndicator: FC<ProjectIndicatorProps> = ({
  position,
  positionCb = (v) => v,
}) => {
  const line: Shape | null = useMemo(() => {
    if (!position) return null;

    const len = remap(
      Math.random(),
      -1,
      1,
      -INDICATOR_OFFSET,
      INDICATOR_OFFSET
    );
    const indicator = subVec(position, {
      x: len,
      y: -Math.abs(len),
    });

    const positions = [
      position,
      indicator,
      {
        x: indicator.x,
        y: 1,
      },
    ];

    const points: Vector2[] = positions.map((pos) => {
      const vec = positionCb(pos);
      return new Vector2(vec.x, vec.y);
    });

    const shape = new Shape(points);
    return shape;
  }, [position]);

  return line ? (
    <group renderOrder={1001} position={[0, 0, 10]}>
      <ShapeView shape={line} color="blue" thickness={0.01} />
    </group>
  ) : null;
};

export default ProjectIndicator;
