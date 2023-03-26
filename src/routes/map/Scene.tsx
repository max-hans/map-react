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
import { useEffectOnce } from "react-use";
import { MathUtils, Mesh, TextureLoader } from "three";
import { Vec2D } from "@/types/data";
import { projects } from "@/data";

const calcWfromH = (h: number): number => {
  const w = h / (1080 / 1920);
  return w;
};

const Scene = () => {
  const { viewport, camera } = useThree();
  const scenarios = useLoader(TextureLoader, futures);
  const [targetZoomFactor, move] = useUiStore((state) => [
    state.targetZoomFactor,
    state.move,
  ]);

  const [onSelect] = useMainStore((state) => [state.onSelect]);

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

  const moveCamera = (dir: Partial<Vec2D>) => {
    setPos(() => {
      const tempPos = { ...pos };
      const { width, height } = viewportSizeRef.current;

      const maxX = (planeSize[0] - width / targetZoomFactor) / 2;
      const maxY = (planeSize[1] - height / targetZoomFactor) / 2;

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

      return newPos;
    });
  };

  const [time, scenarioIndex, mode] = useMainStore((state) => [
    state.time,
    state.scenario,
    state.mode,
  ]);

  const scaleToMeshSize = (pos: Vec2D): Vec2D => {
    return {
      x: pos.x * planeSize[0] - planeSize[0] / 2,
      y: pos.y * planeSize[1] - planeSize[1] / 2,
    };
  };

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
    cameraControlsRef.current.zoomTo(targetZoomFactor, true);
    moveCamera({});
  }, [targetZoomFactor]);

  useEffect(() => {
    updateCamera(pos);
  }, [pos]);

  useEffect(() => {
    if (move) {
      moveCamera(move);
    }
  }, [move]);

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
        <mesh
          scale={[planeSize[0], planeSize[1], 1]}
          ref={meshRef}
          position={[0, 0, 0]}
        >
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
        {projects.map((p, i) => {
          const pos = scaleToMeshSize(p.position);

          return (
            <mesh
              position={[pos.x, pos.y, 0]}
              key={`$project-${p.name}`}
              onClick={() => onSelect(i)}
            >
              <sphereGeometry args={[100, 16]} />
              <meshBasicMaterial color="red" attach="white" />
            </mesh>
          );
        })}
      </Suspense>

      <gridHelper
        args={[10000, 100, 0xffffff, 0xffffff]}
        rotation={[MathUtils.DEG2RAD * 90, 0, 0]}
      />
    </>
  );
};

export default Scene;
