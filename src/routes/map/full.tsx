
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";
import Legend from "./comps/Legend";
import * as THREE from "three";

const FullMapView = () => {

  /* https://blog.promaton.com/camera-animations-with-r3f-and-react-spring-6fd378296c46 */

  return (
    <div className="relative overflow-hidden h-full w-full">
      <div className="w-full h-full z-0 absolute left-0 right-0 top-0 bottom-0 bg-blue-300">
        <Canvas
          flat
          orthographic
          dpr={0.5}
          className="w-full"
          camera={{ fov: 75, near: 0.01, far: 200, position: [0, 0, 100] }}
          gl={{ toneMapping: THREE.NoToneMapping }}
        >
          <color attach="background" args={["black"]} />
          <Scene />
        </Canvas>
      </div>
      <Legend />
    </div>
  );
};
export default FullMapView;
