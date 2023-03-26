import { FC, ReactNode, useCallback, useState } from "react";

import { Canvas } from "@react-three/fiber";

import ProjectInspector from "../../../components/ProjectInspector";
import { projects } from "../../../data";
import Controller from "../../../components/Contoller";
import useUiStore from "../../../stores/ui";
import Scene from "../Scene";

import deviceFrame from "../../assets/device-frame.svg";
import { useKeyPressEvent } from "react-use";
import { MOVE_DELTA } from "@/CONSTANTS";

interface FrameProps {
  children: ReactNode;
}

const Frame: FC<FrameProps> = ({ children }) => {
  const [selected, setSelected] = useState<number | null>(null);

  const uiConfig = useUiStore();

  useKeyPressEvent("ArrowUp", () => uiConfig.setMove({ y: -MOVE_DELTA }));
  useKeyPressEvent("ArrowDown", () => uiConfig.setMove({ y: MOVE_DELTA }));
  useKeyPressEvent("ArrowRight", () => uiConfig.setMove({ x: MOVE_DELTA }));
  useKeyPressEvent("ArrowLeft", () => uiConfig.setMove({ x: -MOVE_DELTA }));

  /* https://blog.promaton.com/camera-animations-with-r3f-and-react-spring-6fd378296c46 */

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center p-8 relative">
        {children}
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
export default Frame;
