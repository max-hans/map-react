import { Vec2D } from "@/types/data";
import { Html } from "@react-three/drei";
import { FunctionComponent } from "react";

interface ProjectSphereProps {
  position: Vec2D;
  scaleFactor: number;
  onSelect?: () => void;
  selected: boolean;
}

const ProjectSphere: FunctionComponent<ProjectSphereProps> = ({
  position,
  scaleFactor,
  onSelect = () => {},
  selected,
}) => {
  return (
    <group>
      <mesh position={[position.x, position.y, 20]}>
        <sphereGeometry args={[(selected ? 15 : 6) / scaleFactor, 4]} />
        <meshBasicMaterial color={selected ? "blue" : "white"} />
      </mesh>
    </group>
  );
};

export default ProjectSphere;
