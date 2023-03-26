import { useState } from "react";

import deviceFrame from "../../assets/device-frame.svg";
import { useKeyPressEvent } from "react-use";
import { MOVE_DELTA } from "@/CONSTANTS";
import Frame from "./comps/Frame";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";
import useUiStore from "@/stores/ui";

const Map = () => {
  const uiConfig = useUiStore();

  useKeyPressEvent("ArrowUp", () => uiConfig.setMove({ y: -MOVE_DELTA }));
  useKeyPressEvent("ArrowDown", () => uiConfig.setMove({ y: MOVE_DELTA }));
  useKeyPressEvent("ArrowRight", () => uiConfig.setMove({ x: MOVE_DELTA }));
  useKeyPressEvent("ArrowLeft", () => uiConfig.setMove({ x: -MOVE_DELTA }));

  /* https://blog.promaton.com/camera-animations-with-r3f-and-react-spring-6fd378296c46 */

  return (
    <Frame>
      <div className="relative overflow-hidden h-full bg-green-300">
        <div className="w-full h-full z-0 absolute left-0 right-0 top-0 bottom-0 bg-red-300">
          <Canvas
            flat
            resize={{}}
            orthographic
            className="w-full"
            camera={{ fov: 75, near: 0.01, far: 200, position: [0, 0, 100] }}
          >
            <color attach="background" args={["red"]} />
            <Scene />
            {/* <OrthographicCamera position={[0, 0, 0]} /> */}
          </Canvas>
        </div>
        <img src={deviceFrame} className="w-full h-full z-10 relative" />
      </div>
    </Frame>
  );
};
export default Map;