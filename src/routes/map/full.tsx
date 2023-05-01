import { useState } from "react";

import Frame from "./comps/Frame";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";
import ProjectInspector from "@/components/ProjectInspector";
import { projects } from "@/data";
import SocketAdapter from "@/components/SocketAdapter";

const FullMapView = () => {
  const [selected, setSelected] = useState<number | null>(null);

  /* https://blog.promaton.com/camera-animations-with-r3f-and-react-spring-6fd378296c46 */

  return (
    <div className="relative overflow-hidden h-full w-full bg-red-300">
      <div className="w-full h-full z-0 absolute left-0 right-0 top-0 bottom-0 bg-blue-300">
        <Canvas
          flat
          orthographic
          className="w-full"
          camera={{ fov: 75, near: 0.01, far: 200, position: [0, 0, 100] }}
        >
          <color attach="background" args={["black"]} />
          <Scene />
        </Canvas>
      </div>
    </div>
  );
};
export default FullMapView;
