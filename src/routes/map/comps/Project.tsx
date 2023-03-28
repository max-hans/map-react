import { useLoader } from "@react-three/fiber";
import { FC } from "react";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

import CrossSm from "../res/gfx/cross-sm.svg";

const Shape = ({ shape, rotation, position, color, opacity, index }) => {
  if (!position) return null;
  return (
    <a.mesh
      rotation={rotation}
      position={position.to((x, y, z) => [x, y, z + index * 50])}
    >
      <a.meshPhongMaterial
        color={color}
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
        transparent
      />
      <shapeGeometry args={[shape]} />
    </a.mesh>
  );
};

const ProjectOverlay: FC<ProjectOverlayProps> = ({ position }) => {
  const data = useLoader(SVGLoader, CrossSm);
};

export default ProjectOverlay;
