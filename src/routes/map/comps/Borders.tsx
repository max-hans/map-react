import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { useMemo, FC } from "react";
import { extend, useLoader, useThree } from "@react-three/fiber";
import { BufferGeometry, ShaderMaterial, Shape, Vector2 } from "three";
import { Center } from "@react-three/drei";

import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Geometry } from "three-stdlib";

extend({ MeshLineGeometry, MeshLineMaterial });

type MeshLineGeometryImpl = {
  points: number[];
  widthCallback: (p: number) => number;
} & JSX.IntrinsicElements["bufferGeometry"];

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: MeshLineGeometryImpl;
    }
  }
}

type MeshLimeshLineMaterialImpl = {
  resolution: Vector2;
  lineWidth: number;
} & JSX.IntrinsicElements["lineBasicMaterial"];

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineMaterial: MeshLimeshLineMaterialImpl;
    }
  }
}

interface ShapeViewProps {
  shape: Shape;
}

const ShapeView: FC<ShapeViewProps> = ({ shape }) => {
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
    <mesh>
      <meshLineGeometry points={geo} widthCallback={(p) => p * Math.random()} />
      <meshLineMaterial
        lineWidth={0.004}
        color="white"
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
        container.scale.setX(targetWidth / width);
        container.scale.setY(targetHeight / (height + 24) /* 14.4 */);
        container.position.set(0, -6, 0);
      }}
      scale={[1, 0.8, 1]}
    >
      <group rotation={[Math.PI, 0, 0]} renderOrder={999} position={[0, 0, 2]}>
        {shapes.map((item) => (
          <ShapeView {...item} key={item.index} />
        ))}
      </group>
    </Center>
  );
};

export default Borders;
