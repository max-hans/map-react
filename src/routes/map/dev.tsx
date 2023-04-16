import { useEffect, useState } from "react";

import deviceFrame from "../../assets/device-frame.svg";
import { useKeyPressEvent } from "react-use";
import { MOVE_DELTA, YEARS_MAX, YEARS_MIN } from "@/CONSTANTS";
import Frame from "./comps/Frame";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";
import useUiStore from "@/stores/ui";
import ProjectInspector from "@/components/ProjectInspector";
import { projects, scenarios } from "@/data";
import useSocketIo from "@/hooks/useSocketio";
import { Vec2D } from "@/types/data";
import { directionToVector } from "@/func/socket";
import useMainStore from "@/stores/main";
import { constrain, remap } from "@/func/data";

const ZOOM_DELTA = 0.5;

const MapDev = () => {
  const uiConfig = useUiStore();
  const mainStore = useMainStore();
  const [selected, setSelected] = useState<number | null>(null);

  useKeyPressEvent("ArrowUp", () => uiConfig.setMove({ y: -MOVE_DELTA }));
  useKeyPressEvent("ArrowDown", () => uiConfig.setMove({ y: MOVE_DELTA }));
  useKeyPressEvent("ArrowRight", () => uiConfig.setMove({ x: MOVE_DELTA }));
  useKeyPressEvent("ArrowLeft", () => uiConfig.setMove({ x: -MOVE_DELTA }));

  const { lastMessage } = useSocketIo({ topic: "/" });

  useEffect(() => {
    if (!lastMessage) return;
    const { command, value } = lastMessage;
    switch (command) {
      case "z": {
        if (value === 0) {
          uiConfig.incrementTargetZoomFactor(-ZOOM_DELTA);
        }
        if (value === 1) {
          uiConfig.incrementTargetZoomFactor(ZOOM_DELTA);
        }
        break;
      }

      case "n": {
        let direction = directionToVector(value, MOVE_DELTA);
        console.log(direction);

        uiConfig.setMove(direction);
        break;
      }

      case "h": {
        let year = remap(value, 0, 1000, YEARS_MIN, YEARS_MAX);
        mainStore.setTime(year);
        break;
      }

      case "s": {
        let scenario = constrain(value, 0, scenarios.length - 1);
        mainStore.setScenario(scenario);
        break;
      }
    }
  }, [lastMessage]);

  /* https://blog.promaton.com/camera-animations-with-r3f-and-react-spring-6fd378296c46 */

  return (
    <Frame>
      <div className="relative overflow-hidden h-full w-full">
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
        <ProjectInspector
          projects={projects}
          selected={selected}
          onDeselect={() => setSelected(null)}
        />
      </div>
    </Frame>
  );
};
export default MapDev;
