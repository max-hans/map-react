import { Vec2D } from "@/types/data";
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
}) => {
  return (
    <group>
      <mesh position={[position.x, position.y, 30]}>
        <sphereGeometry args={[15 / scaleFactor, 4]} />
        <meshBasicMaterial color={"blue"} />
      </mesh>
      <mesh position={[position.x, position.y, 40]}>
        <sphereGeometry args={[6 / scaleFactor, 4]} />
        <meshBasicMaterial color={"white"} />
      </mesh>
      <mesh
        position={[position.x, position.y, 30]}
        rotation={[0, 0, Math.PI / 4]}
        scale={1 / scaleFactor}
      >
        <boxGeometry args={[200, 5, 5]} />
        <meshBasicMaterial color={"blue"} />
      </mesh>
      <mesh
        position={[position.x, position.y, 30]}
        rotation={[0, 0, -Math.PI / 4]}
        scale={1 / scaleFactor}
      >
        <boxGeometry args={[200, 5, 5]} />
        <meshBasicMaterial color={"blue"} />
      </mesh>
    </group>
  );
};

export default ProjectSphere;
