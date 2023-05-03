import { SimpleProject, Vec2D } from "@/types/data";
import { FC, useLayoutEffect, useRef } from "react";
import { InstancedMesh, Object3D } from "three";

interface ProjectSphereInstancesProps {
  count: number;
  temp?: THREE.Object3D;
  positions: Vec2D[];
  scaleFactor: number;
}

const ProjectSphereInstances: FC<ProjectSphereInstancesProps> = ({
  count = 100000,
  temp = new Object3D(),
  positions = [],
  scaleFactor,
}) => {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;

    const inverted = 1 / scaleFactor;

    positions.forEach((elem, i) => {
      temp.position.set(elem.x, elem.y, 20);
      temp.scale.set(inverted, inverted, inverted);
      temp.updateMatrix();
      ref.current!.setMatrixAt(i, temp.matrix);
    });

    ref.current.instanceMatrix.needsUpdate = true;
  }, [positions, scaleFactor]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[3, 4]} />
      <meshBasicMaterial color="white" />
    </instancedMesh>
  );
};

export default ProjectSphereInstances;
