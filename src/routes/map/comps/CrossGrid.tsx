import { Svg } from "@react-three/drei";
import { FC, useMemo } from "react";

import cross from "@/assets/map/cross.svg";
import { GroupProps } from "@react-three/fiber";

interface CrossGridProps extends GroupProps {
  dX: number;
  dY: number;
  numW: number;
  numH: number;
  crossScale: number;
}
const CrossGrid: FC<CrossGridProps> = ({
  dX,
  dY,
  numW,
  numH,
  crossScale,
  ...rest
}) => {
  const instances = useMemo(
    () => {
      const shapes = [];
      for (let x = 0; x < numW; x++) {
        for (let y = 0; y < numH; y++) {
          const xpos = x * dX - ((numW - 1) * dX) / 2;
          const ypos = y * dY - ((numH - 1) * dY) / 2;
          console.log(ypos);
          shapes.push(
            <group position={[xpos, ypos, 0]}>
              <Svg src={cross} scale={[crossScale, crossScale, crossScale]} />
            </group>
          );
        }
      }
      console.log(shapes);

      return shapes;
    },
    [
      /* dX, dY, numW, numH */
    ]
  );
  return <group {...rest}>{instances}</group>;
};

export default CrossGrid;
