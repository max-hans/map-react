import { Suspense, useState } from "react";

import deviceFrame from "../../assets/device-frame.svg";
import Frame from "./comps/Frame";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";

import { Html } from "@react-three/drei";

import { projects } from "@/data";
import ProjectInspectorScreen from "@/components/ProjectInspectorScreen";
import TitleScreen from "@/components/TitleScreen";
import useMainStore from "@/stores/main";

const Map = () => {
  const time = useMainStore((state) => state.time);

  const [selected, setSelected] = useState<number | null>(null);

  return (
    <Frame>
      <div className="relative overflow-hidden h-full bg-green-300">
        <div className="w-full h-full z-0 absolute left-0 right-0 top-0 bottom-0 bg-red-200">
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
            <color attach="background" args={["black"]} />
            <Suspense fallback={<Html center>Loading.</Html>}>
              <Scene />
            </Suspense>
          </Canvas>
        </div>

        <ProjectInspectorScreen
          projects={projects}
          selected={selected}
          onDeselect={() => setSelected(null)}
        />

        <TitleScreen temperature={0} time={time} />

        <img
          src={deviceFrame}
          className="w-full h-full z-10 relative pointer-events-none"
        />
      </div>
    </Frame>
  );
};
export default Map;
