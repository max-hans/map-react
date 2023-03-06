import { useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import { MAP_SIZE_X, MAP_SIZE_Y } from "../../CONSTANTS";

import { DisplayMode, History, Scenario } from "../../types/data";

import { history } from "../../data/CONSTANTS";
import { remap } from "../../func/data";

import futures from "../../../public/videos/futures";

import ProjectInspector from "../../components/ProjectInspector";
import { projects, positions, scenarios } from "../../data";
import { useEffectOnce } from "react-use";
import Controller from "../../components/Contoller";
import useMainStore from "../../stores/main";

const Map = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const videoRef = useRef<HTMLVideoElement>();
  const imageRefs = useRef<HTMLImageElement[]>();
  const requestIdRef = useRef<number>();

  const [selected, setSelected] = useState<number | null>(null);

  const [time, scenarioIndex, mode] = useMainStore((state) => [
    state.time,
    state.scenario,
    state.mode,
  ]);

  const currentScenario = scenarios[scenarioIndex];

  const draw = () => {
    const { time, mode, scenario } = useMainStore.getState();
    const future = mode === "FUTURE";
    if (!canvasRef.current || !videoRef.current || !imageRefs.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    /* ctx.globalAlpha = 0.1; */

    console.log(Date.now(), mode, scenario, time);

    if (future) {
      ctx.drawImage(
        imageRefs.current[scenarioIndex],
        0,
        0,
        MAP_SIZE_X,
        MAP_SIZE_Y
      );
      console.log("future");
    } else {
      videoRef.current.currentTime = remap(
        time,
        1950,
        2020,
        0,
        videoRef.current.duration
      );
      ctx.drawImage(videoRef.current, 0, 0, MAP_SIZE_X, MAP_SIZE_Y);
    }
  };

  const tick = () => {
    if (!canvasRef.current) return;
    draw();
    requestIdRef.current = requestAnimationFrame(tick);
  };

  const createHistoryRef = (hist: History): Promise<HTMLVideoElement> => {
    return new Promise((res) => {
      let video = document.createElement("video");
      video.src = `/videos/${hist.src}`;
      video.addEventListener("loadeddata", function () {
        video.currentTime = 0;
        res(video);
      });
    });
  };

  const attachImage = (f: string): Promise<HTMLImageElement> => {
    return new Promise((res) => {
      const img = document.createElement("img");
      img.src = f;
      img.onload = () => {
        res(img);
      };
    });
  };

  const createFutureRefs = (scenarios: Scenario[]) => {
    const promises = scenarios.map((s) => {
      return attachImage(`/videos/futures/${s.data}`);
    });
    return Promise.all(promises);
  };

  useEffectOnce(() => {
    Promise.all([createHistoryRef(history), createFutureRefs(scenarios)]).then(
      ([vid, imgs]) => {
        console.log(imgs);

        videoRef.current = vid;
        imageRefs.current = imgs;
        requestIdRef.current = requestAnimationFrame(tick);
      }
    );

    return () => {
      if (requestIdRef.current) cancelAnimationFrame(requestIdRef.current);
    };
  });

  return (
    <>
      <div className=" w-full h-full flex flex-col justify-center items-center p-8 relative">
        <div className="bg-blue-500 relative aspect-video rounded-md overflow-hidden shadow-lg h-full">
          <div className="absolute top-0 left-0 w-full h-full">
            <canvas
              className="w-full aspect-video"
              ref={canvasRef}
              width={MAP_SIZE_X}
              height={MAP_SIZE_Y}
            />
          </div>
          <div className="absolute top-0 left-0 z-10 w-full h-full">
            <svg
              viewBox="0 0 1920 1080"
              className="absolute top-0 left-0 w-full h-full"
            >
              <>
                {projects.map((project, idx) => {
                  return (
                    <circle
                      cx={`${project.position.x * 100}%`}
                      cy={`${project.position.y * 100}%`}
                      r="8"
                      fill="black"
                      onClick={() => {
                        setSelected(idx);
                      }}
                    />
                  );
                })}

                {positions
                  .slice(0, positions.length * currentScenario.projects)
                  .map((position) => {
                    return (
                      <circle
                        className="pointer-cursor"
                        cx={`${position.x * 100}%`}
                        cy={`${position.y * 100}%`}
                        r="2"
                        fill="black"
                      />
                    );
                  })}
              </>
            </svg>
          </div>
        </div>
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
