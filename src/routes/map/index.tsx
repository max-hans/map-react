import { ReactNode, useCallback, useState } from "react";

import { Canvas } from "@react-three/fiber";

import ProjectInspector from "../../components/ProjectInspector";
import { projects } from "../../data";
import Controller from "../../components/Contoller";
import useUiStore from "../../stores/ui";
import Scene from "./Scene";

import deviceFrame from "../../assets/device-frame.svg";

const Map = () => {
  const [selected, setSelected] = useState<number | null>(null);

  const uiConfig = useUiStore();

  const renderScene = useCallback(
    (s: ReactNode) => {
      if (uiConfig.showFrame) {
        return (
          <div className="relative overflow-hidden h-full bg-green-300">
            <div className="w-full h-full z-0 absolute left-0 right-0 top-0 bottom-0 bg-red-300">
              {s}
            </div>
            <img src={deviceFrame} className="w-full h-full z-10 relative" />
          </div>
        );
      } else {
        return (
          <div className="relative overflow-hidden h-full w-full">
            <div className="w-full h-full z-0 absolute left-0 right-0 top-0 bottom-0">
              {s}
            </div>
          </div>
        );
      }
    },
    [uiConfig]
  );

  /* https://blog.promaton.com/camera-animations-with-r3f-and-react-spring-6fd378296c46 */

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center p-8 relative">
        {renderScene(
          <Canvas resize={{}} orthographic className="w-full">
            <color attach="background" args={["red"]} />
            <Scene />
          </Canvas>
        )}
      </div>
      <ProjectInspector
        projects={projects}
        selected={selected}
        onDeselect={() => setSelected(null)}
      />
      <Controller />
    </>
  );
};
export default Map;
