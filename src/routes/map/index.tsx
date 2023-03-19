import { useSpring, animated, SpringRef } from "@react-spring/web";

import {
  ReactNode,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
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

import deviceFrame from "../../assets/device-frame.svg";

const Map = () => {
  const [selected, setSelected] = useState<number | null>(null);

  const uiConfig = useUiStore();

  useKeyboardControls();

  const renderScene = (s: ReactNode) => {
    console.log(uiConfig.showFrame);

    if (uiConfig.showFrame) {
      return (
        <div className="relative overflow-hidden h-full">
          <div className="w-full h-full z-0 absolute left-0 right-0 top-0 bottom-0">
            {s}
          </div>
          <img src={deviceFrame} className="w-full h-full z-10 relative" />
        </div>
      );
    } else {
      return (
        <div className="relative overflow-hidden h-full aspect-video">
          <div className="w-full h-full z-0 absolute left-0 right-0 top-0 bottom-0">
            {s}
          </div>
        </div>
      );
    }
  };

  /* https://blog.promaton.com/camera-animations-with-r3f-and-react-spring-6fd378296c46 */

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center p-8 relative">
        {renderScene(
          <Canvas resize={{ scroll: false }}>
            <MapControls enableZoom={false} />
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
