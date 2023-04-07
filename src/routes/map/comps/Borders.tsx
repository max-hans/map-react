import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { useMemo, FC, useRef } from "react";
import { extend, useLoader } from "@react-three/fiber";
import { Shape } from "three";
import { Center } from "@react-three/drei";

import { MeshLineGeometry, MeshLineMaterial, raycast } from "meshline";
extend({ MeshLineGeometry, MeshLineMaterial });

interface ShapeViewProps {
  shape: Shape;
}

const D3ShapeView: FC<ShapeViewProps> = ({ shape }) => {
  const geo = useMemo(() => {
    const points = shape
      .extractPoints(1)
      .shape.map((elem) => [elem.x, elem.y, 0])
      .flat();

    return points;
  }, [shape]);

  /* https://github.com/pmndrs/meshline */

  return (
    <group>
      <mesh>
        <meshBasicMaterial
          color={"lightgray"}
          opacity={0.1}
          transparent={true}
          depthWrite={true}
        />
        <extrudeGeometry
          args={[
            shape,
            {
              bevelEnabled: false,
            },
          ]}
        />
      </mesh>

      <mesh raycast={raycast} /* renderOrder={1000} */ position={[0, 0, -1]}>
        <meshLineGeometry points={geo} />
        <meshLineMaterial lineWidth={0.002} color="black" />
      </mesh>
    </group>
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
        console.log(targetHeight);
        container.scale.setX(targetWidth / (width + 14.4));
        container.scale.setY(targetHeight / (height + 28.8) /* 14.4 */);
      }}
      scale={[1, 0.8, 1]}
    >
      <group rotation={[Math.PI, 0, 0]}>
        {shapes.map((item) => (
          <D3ShapeView {...item} key={item.index} />
        ))}
      </group>
    </Center>
  );
};

export default Borders;
