import {
  MOVE_DELTA,
  YEARS_MIN,
  YEARS_MAX,
  ZOOM_DELTA,
  ZOOM_FRAME_DELTA,
  ZOOM_INTERVAL,
  MOVEMENT_THRESHOLD,
  MOVEMENT_SCALE_FACTOR,
} from "@/CONSTANTS";
import { scenarios } from "@/data";
import { remap, constrain } from "@/func/data";
import useSocketIo from "@/hooks/useSocketio";
import useMainStore from "@/stores/main";
import useUiStore from "@/stores/ui";
import { useEffect, useState } from "react";
import { useInterval } from "react-use";

const allDefinedAndNotZero = (...args: Array<number | undefined>) => {
  return args.some((elem) => !!elem);
};

const SocketAdapter = ({ topic }: { topic: string }) => {
  const [incrementTargetZoomFactor, setMove] = useUiStore((state) => [
    state.incrementTargetZoomFactor,
    state.setMove,
  ]);
  const [setTime, setScenario] = useMainStore((state) => [
    state.setTime,
    state.setScenario,
  ]);

  const { lastMessage } = useSocketIo({ topic });

  const [zoomDelta, setZoomingDelta] = useState(0);

  const [xDelta, setXDelta] = useState(0);
  const [yDelta, setYDelta] = useState(0);

  useInterval(
    () => {
      console.log("interval");

      if (zoomDelta) incrementTargetZoomFactor(zoomDelta);

      if (xDelta || yDelta) {
        const delta = { x: xDelta, y: yDelta };
        console.log("delta", delta);
        setMove(delta);
      }
    },
    allDefinedAndNotZero(zoomDelta, xDelta, yDelta) ? ZOOM_INTERVAL : null
  );

  useEffect(() => {
    if (!lastMessage) return;
    const { command, value } = lastMessage;

    if (command === "x") {
      console.log(command, value);
    }
    switch (command) {
      case "z": {
        setZoomingDelta(ZOOM_FRAME_DELTA * value);
        break;
      }

      case "h": {
        let year = constrain(
          remap(value, 0, 1000, YEARS_MIN, YEARS_MAX),
          YEARS_MIN,
          YEARS_MAX
        );
        setTime(year);
        break;
      }

      case "x": {
        if (Math.abs(value) > MOVEMENT_THRESHOLD)
          setXDelta(value * MOVEMENT_SCALE_FACTOR);
        break;
      }

      case "y": {
        if (Math.abs(value) > MOVEMENT_THRESHOLD)
          setYDelta(value * MOVEMENT_SCALE_FACTOR);
        break;
      }

      case "s": {
        let scenario = constrain(value, 0, scenarios.length - 1);
        setScenario(scenario);
        break;
      }
    }
  }, [lastMessage]);

  return null;
};

export default SocketAdapter;
