import { Vec2D } from "@/types/data";
import { Html } from "@react-three/drei";
import { FunctionComponent } from "react";

interface ProjectSphereProps {
  position: Vec2D;
  scaleFactor: number;
  onSelect: () => void;
  selected: boolean;
}

const ProjectSphere: FunctionComponent<ProjectSphereProps> = ({
  position,
  scaleFactor,
  onSelect,
  selected,
}) => {
  return (
    <group>
      {/* <Html center>
        <div className="w-24 h-24 bg-white">
          <p>test</p>
        </div>
      </Html> */}
      <mesh position={[position.x, position.y, 0]}>
        <sphereGeometry args={[6 / scaleFactor, 16]} />
        <meshBasicMaterial color={selected ? "blue" : "white"} />
      </mesh>

      <mesh position={[position.x, position.y, 0]} onClick={onSelect}>
        <sphereGeometry args={[20 / scaleFactor, 2]} />
        <meshBasicMaterial color="red" transparent opacity={0} />
      </mesh>
    </group>
  );
};

export default ProjectSphere;
