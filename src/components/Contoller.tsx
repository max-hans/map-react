import { MAX_ZOOM, MIN_ZOOM } from "../CONSTANTS";
import { scenarios } from "../data";
import useMainStore from "../stores/main";
import useUiStore from "../stores/ui";
import Slider from "./Slider";

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

  return (
    <div
      className={`fixed top-8 right-8 bg-white p-4 flex flex-col space-y-4 rounded-md shadow-md w-72 z-50`}
    >
      <h2>Controller</h2>

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

      <Slider
        title="zoom"
        value={uiConfig.targetZoomFactor}
        onValue={uiConfig.setTargetZoomFactor}
        min={MIN_ZOOM}
        max={MAX_ZOOM}
        useFloat
        step={0.1}
      />
    </div>
  );
};

export default Controller;

/* {
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
    scenarioIndex: {
      value: 0,
      min: 0,
      max: scenarios.length - 1,
      step: 1,
      onChange: (v) => {
        setMode("FUTURE");
      },
      transient: false
    },
    blur: {
      value: 0,
      min: 0,
      max: 20,
      step: 1,
    },
    future: true,
    position: {
      value: { x: 0, y: 0 },
      step: 0.1,
      joystick: false,
      editable: false,
    },
  }, */
