import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { useMemo, FC } from "react";
import { extend, useLoader, useThree } from "@react-three/fiber";
import { Shape, Vector2 } from "three";
import { Center } from "@react-three/drei";

import { MeshLineGeometry, MeshLineMaterial } from "meshline";
extend({ MeshLineGeometry, MeshLineMaterial });

interface ShapeViewProps {
  shape: Shape;
}

const D3ShapeView: FC<ShapeViewProps> = ({ shape }) => {
  const { viewport } = useThree();
  const geo = useMemo(() => {
    const points = shape
      .extractPoints(1)
      .shape.map((elem) => [elem.x, elem.y, 0])
      .flat();

    return points;
  }, [shape]);

  /* https://github.com/pmndrs/meshline */

  return (
    <mesh renderOrder={999}>
      <meshLineGeometry points={geo} widthCallback={(p) => p * Math.random()} />
      <meshLineMaterial
        lineWidth={0.005}
        color="blue"
        resolution={new Vector2(viewport.width, viewport.height)}
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
