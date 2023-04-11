import { Suspense, useRef, useState } from "react";

import deviceFrame from "../../assets/device-frame.svg";
import { useKeyPressEvent } from "react-use";
import { MOVE_DELTA } from "@/CONSTANTS";
import Frame from "./comps/Frame";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import Scene from "./Scene";
import useUiStore from "@/stores/ui";

import { Html } from "@react-three/drei";

import ProjectInspector from "@/components/ProjectInspector";
import { projects } from "@/data";

const Map = () => {
  const uiConfig = useUiStore();

  useKeyPressEvent("ArrowUp", () => uiConfig.setMove({ y: -MOVE_DELTA }));
  useKeyPressEvent("ArrowDown", () => uiConfig.setMove({ y: MOVE_DELTA }));
  useKeyPressEvent("ArrowRight", () => uiConfig.setMove({ x: MOVE_DELTA }));
  useKeyPressEvent("ArrowLeft", () => uiConfig.setMove({ x: -MOVE_DELTA }));

  /* https://blog.promaton.com/camera-animations-with-r3f-and-react-spring-6fd378296c46 */

  const [selected, setSelected] = useState<number | null>(null);

  return (
    <Frame>
      <div className="relative overflow-hidden h-full bg-green-300">
        <div className="w-full h-full z-0 absolute left-0 right-0 top-0 bottom-0">
          <Canvas
            resize={{}}
            orthographic
            className="w-full"
            camera={{ fov: 75, near: 0.01, far: 200, position: [0, 0, 100] }}
            gl={{
              powerPreference: "high-performance",
              alpha: false,
              antialias: false,
              stencil: false,
              depth: false,
            }}
          >
            <color attach="background" args={["red"]} />
            <Suspense fallback={<Html center>Loading.</Html>}>
              <Scene />
            </Suspense>
          </Canvas>
        </div>
        <ProjectInspector
          projects={projects}
          selected={selected}
          onDeselect={() => setSelected(null)}
        />
        <img
          src={deviceFrame}
          className="w-full h-full z-10 relative pointer-events-none"
        />
      </div>
    </Frame>
  );
};
export default Map;
