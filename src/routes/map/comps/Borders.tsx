import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { useMemo, FC, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { ExtrudeGeometry, Shape } from "three";
import { Center } from "@react-three/drei";

interface ShapeViewProps {
  shape: Shape;
}
const ShapeView: FC<ShapeViewProps> = ({ shape }) => {
  return (
    <lineLoop position={[0, 0, 5]}>
      <lineBasicMaterial
        color={"black"}
        opacity={1}
        linewidth={20}
        fog={false}
        linejoin="round"
      />
      <shapeGeometry args={[shape]} />
    </lineLoop>
  );
};

const D3ShapeView: FC<ShapeViewProps> = ({ shape }) => {
  return (
    <mesh>
      <meshBasicMaterial color={"black"} opacity={0.4} /* transparent */ />
      <extrudeGeometry
        args={[
          shape,
          {
            depth: 20,
            bevelEnabled: false,
            bevelSize: 5,
            bevelOffset: 5,
          },
        ]}
      />
    </mesh>
  );
};

interface BordersProps {
  height: number;
  width: number;
}
const Borders: FC<BordersProps> = ({
  height: targetHeight,
  width: targetWidth,
}) => {
  const data = useLoader(SVGLoader, "/borders.svg");

  const shapes = useMemo(
    () =>
      data.paths.flatMap((g, index) =>
        g
          .toShapes(true)
          .map((shape: Shape) => ({ shape: shape, color: g.color, index }))
      ),
    [data]
  );

  return (
    <Center
      onCentered={({ container, height, width }) => {
        console.log(targetHeight);
        container.scale.setX(targetWidth / (width + 14.4));
        container.scale.setY(targetHeight / (height + 28.8) /* 14.4 */);
      }}
      /* position={[0, -20, 0]} */
      scale={[1, 0.8, 1]}
    >
      <group rotation={[Math.PI, 0, 0]}>
        {shapes.map((item) => (
          <ShapeView {...item} key={item.index} />
        ))}
      </group>
    </Center>
  );
};

export default Borders;
