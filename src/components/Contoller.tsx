import { useState } from "react";
import {
  MAX_ZOOM,
  MIN_ZOOM,
  MOVE_DELTA,
  YEARS_MAX,
  YEARS_MIN,
} from "../CONSTANTS";
import { projects, scenarios } from "../data";
import useMainStore from "../stores/main";
import useUiStore from "../stores/ui";
import Slider from "./Slider";
import { useKeyPress, useKeyPressEvent } from "react-use";

type Direction = "up" | "left" | "right" | "down";

const Controller = () => {
  const [time, setTime, scenario, setScenario, mode, setMode, onSelect] =
    useMainStore((state) => [
      state.time,
      state.setTime,
      state.scenario,
      state.setScenario,
      state.mode,
      state.setMode,
      state.onSelect,
    ]);

  const [collapse, setCollapse] = useState(false);

  const [devMode, setDevMode] = useState(false);
  useKeyPressEvent("d", () => setDevMode((val) => !val));

  const uiConfig = useUiStore();

  const handleMove = (d: Direction) => {
    switch (d) {
      case "down": {
        uiConfig.setMove({ y: -MOVE_DELTA });
        break;
      }
      case "up": {
        uiConfig.setMove({ y: MOVE_DELTA });
        break;
      }
      case "left": {
        uiConfig.setMove({ x: -MOVE_DELTA });
        break;
      }
      case "right": {
        uiConfig.setMove({ x: MOVE_DELTA });
        break;
      }
    }
  };

  const handleScrub = (d: number) => {
    setTime(time + d);
  };

  const selectRandomProject = () => {
    const idx = Math.floor(Math.random() * projects.length);
    onSelect(idx);
  };

  return devMode ? (
    <div
      className={`fixed top-8 right-8 bg-white p-4 flex flex-col space-y-4 rounded-md shadow-md w-72 z-50 transition-all ${
        collapse ? "translate-x-full" : ""
      }`}
      style={{ transform: `${collapse ? "translate(100%,0)" : ""}` }}
    >
      <button onClick={() => setCollapse((state) => !state)} className="w-min">
        hide
      </button>
      <h2>data</h2>
      <Slider
        title="time"
        value={time}
        onValue={setTime}
        min={YEARS_MIN}
        max={YEARS_MAX}
      />
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleScrub(-1)}
          className="py-2 text-center w-full border border-gray-300 rounded-md"
        >
          {"<<"}
        </button>
        <button
          onClick={() => handleScrub(1)}
          className="py-2 text-center w-full border border-gray-300 rounded-md"
        >
          {">>"}
        </button>
      </div>
      <Slider
        title="scenario"
        value={scenario}
        onValue={setScenario}
        min={0}
        max={scenarios.length - 1}
        step={1}
      />
      <div className="w-full">
        <div className="flex flex-row justify-between">
          <h3 className="font-bold">mode</h3>
          <p className="italic">{mode}</p>
          <button
            onClick={() => setMode("HISTORY")}
            className="py-2 text-center w-full col-span-2 border border-gray-300 rounded-md"
          >
            history
          </button>
          <button
            onClick={() => setMode("FUTURE")}
            className="py-2 text-center w-full col-span-2 border border-gray-300 rounded-md"
          >
            future
          </button>
        </div>
      </div>
      <button
        onClick={() => onSelect(null)}
        className="py-2 text-center w-full col-span-2 border border-gray-300 rounded-md"
      >
        deselect
      </button>
      <h2>navigation</h2>
      <Slider
        title="zoom"
        value={uiConfig.targetZoomFactor}
        onValue={uiConfig.setTargetZoomFactor}
        min={MIN_ZOOM}
        max={MAX_ZOOM}
        useFloat
        step={0.1}
      />
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleMove("up")}
          className="py-2 text-center w-full col-span-2 border border-gray-300 rounded-md"
        >
          up
        </button>
        <button
          onClick={() => handleMove("left")}
          className="py-2 text-center w-full border border-gray-300 rounded-md"
        >
          left
        </button>
        <button
          onClick={() => handleMove("right")}
          className="py-2 text-center w-full border border-gray-300 rounded-md"
        >
          right
        </button>
        <button
          onClick={() => handleMove("down")}
          className="py-2 text-center w-full col-span-2 border border-gray-300 rounded-md"
        >
          down
        </button>
      </div>
      <button
        onClick={selectRandomProject}
        className="py-2 text-center w-full col-span-2 border border-gray-300 rounded-md"
      >
        select random project
      </button>
      <h2>view</h2>
      <div className="w-full flex flex-row space-x-4">
        <div className="underline text-blue-600">
          <a href="/map">/standard</a>
        </div>
        <div className="underline text-blue-600">
          <a href="/dev">/develop</a>
        </div>
      </div>
    </div>
  ) : null;
};

export default Controller;
