import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { useMemo, FC } from "react";
import { useLoader } from "@react-three/fiber";
import { Shape } from "three";
import { Center } from "@react-three/drei";

import ShapeView from "./ShapeView";

interface BordersProps {
  height: number;
  width: number;
  thicknessFactor: number;
}

const Borders: FC<BordersProps> = ({
  height: targetHeight,
  width: targetWidth,
  thicknessFactor,
}) => {
  const data = useLoader(SVGLoader, "/borders_3_repair.svg");

  const shapes = useMemo(
    () =>
      data.paths
        .flat()
        .filter((g) => !(g.userData!.node.id === "FRAME"))
        .flatMap((g, index) => {
          return g
            .toShapes(true)
            .map((shape: Shape) => ({ shape: shape, color: g.color, index }));
        }),
    [data]
  );

  return (
    <Center
      onCentered={({ container, height, width }) => {
        container.scale.setX(targetWidth / width);
        container.scale.setY(targetHeight / (height + 24) /* 14.4 */);
        container.position.set(0, -6, 0);
      }}
      scale={[1, 0.8, 1]}
    >
      <group rotation={[Math.PI, 0, 0]} renderOrder={999} position={[0, 0, 2]}>
        {shapes.map((item) => (
          <ShapeView
            {...item}
            key={item.index}
            thickness={0.004 * thicknessFactor}
            color="white"
          />
        ))}
      </group>
    </Center>
  );
};

export default Borders;
