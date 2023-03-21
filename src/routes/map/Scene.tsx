import { useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";

import { history } from "../../data/CONSTANTS";
import VideoMaterial from "./comps/VideoMaterial";
import useMainStore from "../../stores/main";
import { constrain, remap } from "../../func/data";

import useUiStore from "../../stores/ui";

import futures from "./res/futures";

import { CameraControls } from "@react-three/drei";
import { MAX_ZOOM, MIN_ZOOM } from "../../CONSTANTS";
import { useEffectOnce, useKeyPressEvent } from "react-use";
import { MathUtils, Mesh, TextureLoader } from "three";
import { Vec2D } from "@/types/data";
import { update } from "@react-spring/web";

const calcWfromH = (h: number): number => {
  const w = h / (1080 / 1920);
  return w;
};

const MOVE_DELTA = 100;

const Scene = () => {
  const { viewport, camera } = useThree();
  const scenarios = useLoader(TextureLoader, futures);
  const uiConfig = useUiStore();
  const meshRef = useRef<Mesh>(null);

  const viewportSizeRef = useRef({ width: -1, height: -1 });

  const [pos, setPos] = useState<Vec2D>({ x: 0, y: 0 });

  const [planeSize] = useState(() => {
    const h = viewport.height;
    const w = calcWfromH(h);
    return [w, h];
  });

  const updateCamera = (pos: Vec2D) => {
    if (!cameraControlsRef.current) return;
    cameraControlsRef.current.moveTo(pos.x, pos.y, 0, true);
  };

  const moveCamera = (dir: Partial<{ x: number; y: number }>) => {
    setPos(() => {
      const tempPos = { ...pos };
      const { width, height } = viewportSizeRef.current;

      const maxX = (planeSize[0] - width / uiConfig.targetZoomFactor) / 2;
      const maxY = (planeSize[1] - height / uiConfig.targetZoomFactor) / 2;

      if (dir.x) {
        tempPos.x = tempPos.x + dir.x;
      }
      if (dir.y) {
        tempPos.y = tempPos.y + dir.y;
      }
      const newPos = {
        x: constrain(tempPos.x, -maxX, maxX),
        y: constrain(tempPos.y, -maxY, maxY),
      };

      console.log(maxX, newPos.x);
      return newPos;
    });
  };

  const [time, scenarioIndex, mode] = useMainStore((state) => [
    state.time,
    state.scenario,
    state.mode,
  ]);

  const cameraControlsRef = useRef<CameraControls>(null);

  useEffectOnce(() => {
    if (!cameraControlsRef.current) return;
    cameraControlsRef.current.removeAllEventListeners("controlstart");
    viewportSizeRef.current = {
      width: viewport.width,
      height: viewport.height,
    };
  });

  useEffect(() => {
    if (!cameraControlsRef.current) return;
    cameraControlsRef.current.zoomTo(uiConfig.targetZoomFactor, true);
    moveCamera({});
  }, [uiConfig.targetZoomFactor]);

  useEffect(() => {
    updateCamera(pos);
  }, [pos]);

  useKeyPressEvent("ArrowUp", () => moveCamera({ y: -MOVE_DELTA }));
  useKeyPressEvent("ArrowDown", () => moveCamera({ y: MOVE_DELTA }));
  useKeyPressEvent("ArrowRight", () => moveCamera({ x: MOVE_DELTA }));
  useKeyPressEvent("ArrowLeft", () => moveCamera({ x: -MOVE_DELTA }));

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
        makeDefault
      />

      <Suspense
        fallback={<meshStandardMaterial attach="material" color="red" />}
      >
        <mesh scale={[planeSize[0], planeSize[1], 1]} ref={meshRef}>
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
      {/* <CrossGrid
        dX={CROSS_DELTA}
        dY={CROSS_DELTA}
        numW={stageSize[0] / CROSS_DELTA}
        numH={stageSize[1] / CROSS_DELTA}
        crossScale={0.01}
      /> */}
      <gridHelper
        args={[10000, 100, 0xffffff, 0xffffff]}
        rotation={[MathUtils.DEG2RAD * 90, 0, 0]}
      />
    </>
  );
};

export default Scene;
