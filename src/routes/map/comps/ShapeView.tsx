import { MeshProps, extend, useThree } from "@react-three/fiber";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { FC, useMemo } from "react";
import { Color, Shape, Vector2 } from "three";

extend({ MeshLineGeometry, MeshLineMaterial });

type MeshLineGeometryImpl = {
  points: number[];
  widthCallback?: (p: number) => number;
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

interface ShapeViewProps extends MeshProps {
  shape: Shape;
  thickness: number;
  color: Color | string;
}

const ShapeView: FC<ShapeViewProps> = ({
  shape,
  thickness,
  color,
  ...rest
}) => {
  const { viewport } = useThree();

  const res = useMemo(() => {
    return new Vector2(viewport.width, viewport.height);
  }, [viewport]);

  const geo = useMemo(() => {
    const points = shape
      .extractPoints(1)
      .shape.map((elem) => [elem.x, elem.y, 0])
      .flat();

    return points;
  }, [shape]);

  /* https://github.com/pmndrs/meshline */

  return (
    <mesh {...rest}>
      <meshLineGeometry points={geo} />
      <meshLineMaterial lineWidth={thickness} color={color} resolution={res} />
    </mesh>
  );
};

export default ShapeView;
