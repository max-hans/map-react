import { useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";

import { history } from "../../data/CONSTANTS";
import VideoMaterial from "./comps/VideoMaterial";
import useMainStore from "../../stores/main";
import { constrain, remap } from "../../func/data";

import useUiStore from "../../stores/ui";

import futures from "./res/futures";

import { nanoid } from "nanoid";

import { CameraControls } from "@react-three/drei";
import { MAX_ZOOM, MIN_ZOOM } from "../../CONSTANTS";
import { useEffectOnce } from "react-use";
import { MathUtils, Mesh, TextureLoader } from "three";
import { Vec2D } from "@/types/data";
import { projects } from "@/data";
import positions from "../../data/raw/random-positions.json";
import Borders from "./comps/Borders";

import { EffectComposer, Noise, Vignette } from "@react-three/postprocessing";

const NUM_PROJECTS_DEV = 20;

const calcWfromH = (h: number): number => {
  const w = h / (1080 / 1920);
  return w;
};

const Scene = () => {
  const { viewport, camera } = useThree();
  const scenarios = useLoader(TextureLoader, futures);
  const [targetZoomFactor, setTargetZoomFactor, move] = useUiStore((state) => [
    state.targetZoomFactor,
    state.setTargetZoomFactor,
    state.move,
  ]);

  const [onSelect, selected] = useMainStore((state) => [
    state.onSelect,
    state.selected,
  ]);

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

  /* const projects: Project[] = useMemo(() => {
    let proj: Project[] = [];
    for (let i = 0; i < NUM_PROJECTS_DEV; i++) {
      proj.push({
        ...projects[i % projects.length],
        name: nanoid(),
        position: { x: Math.random(), y: Math.random() },
      });
    }
    return proj;
  }, [projects]); */

  const positionsIndexed = useMemo(
    () => positions.map((e) => ({ ...e, id: nanoid() })),
    [positions]
  );

  const [time, scenarioIndex, mode] = useMainStore((state) => [
    state.time,
    state.scenario,
    state.mode,
  ]);

  const scaleToMeshSize = (pos: Vec2D): Vec2D => {
    return {
      x: pos.x * planeSize[0] - planeSize[0] / 2,
      y: -pos.y * planeSize[1] + planeSize[1] / 2,
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
    console.log("effect");

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

  const focusPosition = (position: Vec2D, zoom: number) => {
    if (!cameraControlsRef.current) return;
    cameraControlsRef.current.zoomTo(zoom, true);
    updateCamera(position);
  };

  useEffect(() => {
    if (selected === null) {
      focusPosition({ x: 0.5, y: 0.5 }, 1);
    }
  }, [selected]);

  const timeFloat = remap(time, 1950, 2020, 0, 1);

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

      <mesh
        scale={[planeSize[0], planeSize[1], 1]}
        ref={meshRef}
        position={[0, 0, 0]}
      >
        <planeGeometry />
        {mode === "HISTORY" ? (
          <VideoMaterial url={`/videos/${history.src}`} position={timeFloat} />
        ) : (
          <meshBasicMaterial attach="material" map={scenarios[scenarioIndex]} />
        )}
      </mesh>
      {projects.map((p, i) => {
        const projectPos = scaleToMeshSize(p.position);

        if (p.time > time) return null;

        return (
          <mesh
            position={[projectPos.x, projectPos.y, 0]}
            key={`$project-${p.name}`}
            onClick={() => {
              console.log(projectPos);
              focusPosition(projectPos, 3);
              /* setTargetZoomFactor(2);
              moveCamera(subVec(projectPos, pos)); */
              onSelect(i % projects.length);
            }}
          >
            <sphereGeometry args={[3, 16]} />
            <meshBasicMaterial color="red" />
          </mesh>
        );
      })}
      {positionsIndexed
        .slice(0, positionsIndexed.length * timeFloat)
        .map((p, i) => {
          const pos = scaleToMeshSize(p);
          return (
            <mesh position={[pos.x, pos.y, 0]} key={`$position-${p.id}`}>
              <sphereGeometry args={[1, 16]} />
              <meshBasicMaterial color="black" />
            </mesh>
          );
        })}
      <Suspense>
        <Borders height={planeSize[1]} width={planeSize[0]} />
      </Suspense>
      <gridHelper
        position={[0, 0, 10]}
        args={[10000, 100, 0xffffff, 0xffffff]}
        rotation={[MathUtils.DEG2RAD * 90, 0, 0]}
        renderOrder={1000}
      />
      <EffectComposer>
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
        {/* <Pixelation
          granularity={3} // pixel granularity
        /> */}
        <Noise opacity={0.3} />
        {/* <DotScreen
          blendFunction={BlendFunction.NORMAL} // blend mode
          angle={Math.PI * 0.5} // angle of the dot pattern
          scale={1} // scale of the dot pattern
        /> */}
      </EffectComposer>
    </>
  );
};

export default Scene;
