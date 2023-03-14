import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { animated } from "@react-spring/three";

import { history } from "../../data/CONSTANTS";
import VideoMaterial from "./comps/VideoMaterial";
import useMainStore from "../../stores/main";
import { remap } from "../../func/data";

import { useSpring } from "@react-spring/web";
import useUiStore from "../../stores/ui";

import { CameraControls } from "@react-three/drei";
import { MAX_ZOOM, MIN_ZOOM } from "../../CONSTANTS";
import { useEffectOnce } from "react-use";

const Scene = () => {
  const { viewport, camera } = useThree();

  const [time, scenarioIndex, mode] = useMainStore((state) => [
    state.time,
    state.scenario,
    state.mode,
  ]);

  const cameraControlsRef = useRef<CameraControls>(null);

  useEffectOnce(() => {
    if (!cameraControlsRef.current) return;
    /* cameraControlsRef.current.disconnect(); */

    cameraControlsRef.current.removeAllEventListeners("controlstart");
  });
  /* const camRef = useRef<OrthographicCamera>(null); */

  const uiConfig = useUiStore();

  useFrame(() => {});

  useEffect(() => {
    if (!cameraControlsRef.current) return;
    cameraControlsRef.current.zoomTo(uiConfig.targetZoomFactor, true);
  }, [uiConfig]);

  return (
    <>
      {/* <OrthographicCamera position={[0, 0, 10]} makeDefault /> */}
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
        /* verticalDragToForward={verticalDragToForward}
        infinityDolly={infinityDolly} */
      />
      <mesh scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry />
        <Suspense fallback={<meshStandardMaterial />}>
          <VideoMaterial
            url={`/videos/${history.src}`}
            position={remap(time, 1950, 2020, 0, 1)}
          />
        </Suspense>
      </mesh>
    </>
  );
};

export default Scene;
