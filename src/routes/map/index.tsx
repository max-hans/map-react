import { useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import { MAP_SIZE_X, MAP_SIZE_Y } from "../../CONSTANTS";

import { DisplayMode, History } from "../../types/data";

import { history } from "../../data/CONSTANTS";
import { remap } from "../../func/data";
import {
  positionsAsset,
  projectsAsset,
  scenariosAsset,
} from "../../data/assets";
import ProjectInspector from "../../components/ProjectInspector";

const Map = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>();

  const projects = projectsAsset.read();
  const positions = positionsAsset.read();

  const [mode, setMode] = useState<DisplayMode>("HISTORY");
  const [selected, setSelected] = useState<number | null>(null);

  const { time, scenario, blur, future } = useControls(
    {
      time: {
        value: 4,
        min: 1950,
        max: 2020,
        step: 1,
        onChange: (v) => {
          setMode("HISTORY");
        },
        transient: false,
      },
      scenario: {
        value: 0,
        min: 0,
        max: 10,
        step: 1,
        onChange: (v) => {
          setMode("FUTURE");
        },
        transient: false,
      },
      blur: {
        value: 0,
        min: 0,
        max: 20,
        step: 1,
      },
      future: true,
    },
    {}
  );

  const draw = () => {
    if (!canvasRef.current || !videoRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    if (videoRef) {
      ctx.globalAlpha = 0.1;
      /* ctx.fillStyle = "white"; */
      /* ctx.fillRect(0, 0, MAP_SIZE_X, MAP_SIZE_Y); */

      if (blur) ctx.filter = "blur(10px)";

      ctx.drawImage(videoRef.current, 0, 0, MAP_SIZE_X, MAP_SIZE_Y);

      if (future) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = "black";
        ctx.font = "48px serif";
        /* ctx.fillText(`future scenario: ${activeScenario.toFixed(0)}`, 600, 500); */
      }
    }
    requestAnimationFrame(draw);
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

  useEffect(() => {
    createHistoryRef(history).then((vid) => {
      videoRef.current = vid;
      requestAnimationFrame(draw);
    });
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = remap(
      time,
      1950,
      2020,
      0,
      videoRef.current.duration
    );
    console.log(time);
  }, [time]);

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
            {/* <MapRenderer {history} {time} activeScenario={scenarioIdx} {mode} /> */}
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

                {positions.map((position) => {
                  <circle
                    className="pointer-cursor"
                    cx={`${position.x * 100}%`}
                    cy={`${position.y * 100}%`}
                    r="2"
                    fill="black"
                  />;
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
    </>
  );
};
export default Map;
