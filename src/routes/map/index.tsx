import { useSpring, animated, SpringRef } from "@react-spring/web";

import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { MAP_SIZE_X, MAP_SIZE_Y } from "../../CONSTANTS";

import { history } from "../../data/CONSTANTS";
import { remap } from "../../func/data";
import { MapControls } from "@react-three/drei";

import { Canvas, useThree } from "@react-three/fiber";

import ProjectInspector from "../../components/ProjectInspector";
import { projects, positions, scenarios } from "../../data";
import { useEffectOnce, useKeyPressEvent } from "react-use";
import Controller from "../../components/Contoller";
import useMainStore from "../../stores/main";
import { attachImage, createFutureRefs, createHistoryRef } from "./func";
import useUiStore from "../../stores/ui";
import Scene from "./Scene";
import useKeyboardControls from "../../hooks/useKeyboardControls";

const Map = () => {
  const zoomRef = useRef<{ z: number }>({ z: 1 });

  const uiConfig = useUiStore();

  const [selected, setSelected] = useState<number | null>(null);

  useKeyboardControls();

  /* https://blog.promaton.com/camera-animations-with-r3f-and-react-spring-6fd378296c46 */

  useSpring<{ z: number }>(
    {
      z: uiConfig.targetZoomFactor,
      onChange: (z) => {
        zoomRef.current = z.value as { z: number };
      },
    },
    [uiConfig]
  );

  return (
    <>
      <div className=" w-full h-full flex flex-col justify-center items-center p-8 relative">
        <div className="bg-blue-500 relative aspect-video rounded-md overflow-hidden shadow-lg h-full">
          <div className="absolute top-0 left-0 w-full h-full">
            <Canvas resize={{ scroll: false }}>
              <MapControls enableZoom={false} />
              <Scene />
            </Canvas>
          </div>
        </div>
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
