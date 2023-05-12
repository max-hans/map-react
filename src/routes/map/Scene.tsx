import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";

import { history } from "../../data/CONSTANTS";
import VideoMaterial from "./comps/VideoMaterial";
import useMainStore from "../../stores/main";
import { constrain, remap, withinBounds } from "../../func/data";

import useUiStore from "../../stores/ui";

import futures from "./res/futures";

import { CameraControls } from "@react-three/drei";
import { MAX_ZOOM, MIN_ZOOM, YEARS_MAX, YEARS_MIN } from "../../CONSTANTS";
import { useEffectOnce } from "react-use";
import { MathUtils, Mesh, TextureLoader, Vector3 } from "three";
import { Project, SimpleProject, Vec2D } from "@/types/data";
import { projects, futureProjects, simpleProjects } from "@/data";
import Borders from "./comps/Borders";

import {
  DotScreen,
  EffectComposer,
  Noise,
  Pixelation,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { addVec } from "./func";
import ProjectSphere from "./comps/ProjectSphere";
import ProjectIndicator from "./comps/ProjectIndicator";
import ProjectSphereInstances from "./comps/ProjectSphereInstance";

const PROJECT_CENTER_OFFSET: Vec2D = { x: 50, y: 50 };

const calcWfromH = (h: number): number => {
  const w = h / (1080 / 1920);
  return w;
};

const Scene = () => {
  const { viewport, camera } = useThree();

  /* refs */
  const cameraControlsRef = useRef<CameraControls>(null);
  const viewportSizeRef = useRef({ width: -1, height: -1 });
  const meshRef = useRef<Mesh>(null);

  /* state */
  const [pos, setPos] = useState<Vec2D>({ x: 0, y: 0 });
  const [planeSize] = useState(() => {
    const h = viewport.height;
    const w = calcWfromH(h);
    return [w, h];
  });
  const [cameraTarget, setCameraTarget] = useState(new Vector3());

  /* stores */
  const [targetZoomFactor, setTargetZoomFactor, move] = useUiStore((state) => [
    state.targetZoomFactor,
    state.setTargetZoomFactor,
    state.move,
  ]);

  const [onSelect, selected, time, scenarioIndex, mode] = useMainStore(
    (state) => [
      state.onSelect,
      state.selected,
      state.time,
      state.scenario,
      state.mode,
    ]
  );

  /* loaders */

  const scenarios = useLoader(TextureLoader, futures);

  /* effect */

  useEffectOnce(() => {
    if (!cameraControlsRef.current) return;
    cameraControlsRef.current.removeAllEventListeners("controlstart");
    viewportSizeRef.current = {
      width: viewport.width,
      height: viewport.height,
    };
  });

  const focusPosition = (position: Vec2D, zoom: number) => {
    setPos(position);
    setTargetZoomFactor(zoom);
  };

  useEffect(() => {
    if (!cameraControlsRef.current) return;

    const constrainedPos = getConstrainedPos(pos, targetZoomFactor);

    let current: Vector3 | undefined = undefined;
    cameraControlsRef.current.getPosition(current!);

    cameraControlsRef.current.moveTo(
      constrainedPos.x,
      constrainedPos.y,
      0,
      true
    );
    cameraControlsRef.current.zoomTo(targetZoomFactor, true);
  }, [targetZoomFactor, pos]);

  /* apply new constrained position to  */
  const getConstrainedPos = (dir: Partial<Vec2D>, zoom: number) => {
    const tempPos = { ...pos };
    const { width, height } = viewportSizeRef.current;

    const maxX = (planeSize[0] - width / zoom) / 2;
    const maxY = (planeSize[1] - height / zoom) / 2;

    if (dir.x) {
      tempPos.x = tempPos.x + dir.x;
    }
    if (dir.y) {
      tempPos.y = tempPos.y + dir.y;
    }
    const newPos = {
      x: constrain(tempPos.x / 2, -maxX, maxX),
      y: constrain(tempPos.y / 2, -maxY, maxY),
    };

    return newPos;
  };

  /* we get new directions from the controls */
  useEffect(() => {
    if (move) {
      const newPos: Vec2D = {
        x: pos.x + (move.x || 0),
        y: pos.y + (move.y || 0),
      };
      const constrained = getConstrainedPos(newPos, targetZoomFactor);

      setPos(constrained);
    }
  }, [move]);

  const scaleToMeshSize = (pos: Vec2D): Vec2D => {
    return {
      x: pos.x * planeSize[0] - planeSize[0] / 2,
      y: -pos.y * planeSize[1] + planeSize[1] / 2,
    };
  };

  useEffect(() => {
    if (selected === null) {
      focusPosition({ x: pos.x, y: 0.5 }, 1);
    }
  }, [selected]);

  const [currentZoom, setCurrentZoom] = useState<number>(1);

  useFrame(() => {
    if (!cameraControlsRef.current) return;

    let vec = new Vector3();
    cameraControlsRef.current.getPosition(vec);
    vec.z = 0;
    if (cameraTarget.distanceTo(vec) > 0.0001) {
      setCameraTarget(vec);
    }
    const currentScaleFactor = cameraControlsRef.current.camera.zoom;
    const delta = Math.abs(currentScaleFactor - targetZoomFactor);
    if (delta > 0.1) {
      setCurrentZoom(currentScaleFactor);
    }
  });

  const filteredProjects: Project[] = useMemo(() => {
    if (mode === "FUTURE") return projects;
    const filtered = projects.filter((e) => e.time < time);
    return filtered;
  }, [time, projects, mode]);

  const filteredPositions: SimpleProject[] = useMemo(() => {
    if (mode === "FUTURE") return simpleProjects;
    return simpleProjects.filter((elem) => elem.time <= time);
  }, [time, simpleProjects, mode]);

  const focussedProject: Project | undefined = useMemo(() => {
    const sorted = filteredProjects
      .map((p) => {
        const mapped = scaleToMeshSize(p.position);

        const pVec = new Vector3(mapped.x, mapped.y, 0);
        const dist = pVec.distanceTo(cameraTarget);
        return { project: p, dist };
      })
      .sort((a, b) => a.dist - b.dist);

    const { width, height } = viewport.getCurrentViewport();

    const closest = sorted[0];

    if (!closest) return;

    const scaledProjectPosition = scaleToMeshSize(closest.project.position);

    const VIEWPORT_PADDING = 20;
    const within =
      withinBounds(
        scaledProjectPosition.x,
        cameraTarget.x - width / 2 + VIEWPORT_PADDING,
        cameraTarget.x + width / 2 - VIEWPORT_PADDING
      ) &&
      withinBounds(
        scaledProjectPosition.y,
        cameraTarget.y - height / 2 + VIEWPORT_PADDING,
        cameraTarget.y + height / 2 - VIEWPORT_PADDING
      );

    return within ? closest.project : undefined;
  }, [cameraTarget, filteredProjects]);

  const timeFloat = remap(time, YEARS_MIN, YEARS_MAX, 0, 1);

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

      <ProjectSphereInstances
        positions={filteredPositions.map((p, i) => {
          return scaleToMeshSize(p.position);
        })}
        count={filteredProjects.length}
        scaleFactor={currentZoom}
      />

      {filteredProjects.map((p, i) => {
        const projectPos = scaleToMeshSize(p.position);

        return (
          <ProjectSphere
            key={`$project-${p.name}`}
            position={projectPos}
            scaleFactor={currentZoom}
            selected={p === focussedProject}
          />
        );
      })}

      {mode === "FUTURE" &&
        futureProjects.map((p, i) => {
          const projectPos = scaleToMeshSize(p.position);

          if (p.time > time) return null;

          return (
            <ProjectSphere
              key={`$project-${p.name}`}
              position={projectPos}
              scaleFactor={currentZoom}
              onSelect={() => {
                focusPosition(addVec(projectPos, PROJECT_CENTER_OFFSET), 3);
                onSelect(i % projects.length);
              }}
              selected={p === focussedProject}
            />
          );
        })}

      <Suspense>
        <Borders
          height={planeSize[1]}
          width={planeSize[0]}
          thicknessFactor={currentZoom}
        />
      </Suspense>

      {focussedProject && (
        <ProjectIndicator
          position={focussedProject.position}
          positionCb={scaleToMeshSize}
          cursorPosition={cameraTarget}
        />
      )}

      <group renderOrder={500}>
        <gridHelper
          position={[0, 0, 1]}
          args={[10000, 50 * Math.pow(2, 2), 0xcccccc, 0xcccccc]}
          rotation={[MathUtils.DEG2RAD * 90, 0, 0]}
        />
      </group>

      <EffectComposer>
        <Vignette eskil={false} offset={0.1} darkness={0.8} />
        <Pixelation
          granularity={1} // pixel granularity
        />
        {/* <Bloom intensity={0.2} /> */}
        <Noise opacity={0.1} />
        <DotScreen
          blendFunction={BlendFunction.SUBTRACT} // blend mode
          angle={Math.PI * 0.2} // angle of the dot pattern
          scale={5} // scale of the dot pattern
          opacity={0.1}
        />
      </EffectComposer>
    </>
  );
};

export default Scene;
