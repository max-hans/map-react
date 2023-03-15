import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { animated } from "@react-spring/three";

import { history } from "../../data/CONSTANTS";
import VideoMaterial from "./comps/VideoMaterial";
import useMainStore from "../../stores/main";
import { remap } from "../../func/data";

import useUiStore from "../../stores/ui";

import futures from "./res/futures";

import { CameraControls } from "@react-three/drei";
import { MAX_ZOOM, MIN_ZOOM } from "../../CONSTANTS";
import { useEffectOnce } from "react-use";
import { TextureLoader } from "three";

const Scene = () => {
  const { viewport, camera } = useThree();
  const scenarios = useLoader(TextureLoader, futures);

  const [time, scenarioIndex, mode] = useMainStore((state) => [
    state.time,
    state.scenario,
    state.mode,
  ]);

  const cameraControlsRef = useRef<CameraControls>(null);

  useEffectOnce(() => {
    if (!cameraControlsRef.current) return;

    cameraControlsRef.current.removeAllEventListeners("controlstart");
  });

  const uiConfig = useUiStore();

  useFrame(() => {});

  useEffect(() => {
    if (!cameraControlsRef.current) return;
    cameraControlsRef.current.zoomTo(uiConfig.targetZoomFactor, true);
  }, [uiConfig]);

  return (
    <>
      <CameraControls
        camera={camera}
        ref={cameraControlsRef}
        minDistance={10}
        enabled={true}
        polarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        azimuthAngle={0}
        minAzimuthAngle={0}
        maxAzimuthAngle={0}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        dollyToCursor={false}
      />
      <Suspense
        fallback={<meshStandardMaterial attach="material" color="red" />}
      >
        <mesh scale={[viewport.width, viewport.height, 1]}>
          <planeGeometry />
          {mode === "HISTORY" ? (
            <VideoMaterial
              url={`/videos/${history.src}`}
              position={remap(time, 1950, 2020, 0, 1)}
            />
          ) : (
            <meshBasicMaterial
              attach="material"
              map={scenarios[scenarioIndex]}
            />
          )}
        </mesh>
      </Suspense>
    </>
  );
};

export default Scene;
