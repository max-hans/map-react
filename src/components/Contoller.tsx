import { Vec2D } from "@/types/data";
import { MAX_ZOOM, MIN_ZOOM, MOVE_DELTA } from "../CONSTANTS";
import { scenarios } from "../data";
import useMainStore from "../stores/main";
import useUiStore from "../stores/ui";
import Slider from "./Slider";

type Direction = "up" | "left" | "right" | "down";

const Controller = () => {
  const [time, setTime, scenario, setScenario, mode, setMode] = useMainStore(
    (state) => [
      state.time,
      state.setTime,
      state.scenario,
      state.setScenario,
      state.mode,
      state.setMode,
    ]
  );

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

  return (
    <div
      className={`fixed top-8 right-8 bg-white p-4 flex flex-col space-y-4 rounded-md shadow-md w-72 z-50`}
    >
      <h2>data</h2>

      <Slider
        title="time"
        value={time}
        onValue={setTime}
        min={1950}
        max={2020}
      />
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
        </div>
        <input
          type="checkbox"
          checked={mode === "FUTURE"}
          onChange={(e) => {
            setMode(e.target.checked ? "FUTURE" : "HISTORY");
          }}
        ></input>
      </div>

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
  );
};

export default Controller;
