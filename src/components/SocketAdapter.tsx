import {
  YEARS_MIN,
  YEARS_MAX,
  MOVEMENT_THRESHOLD,
  MOVEMENT_SCALE_FACTOR,
  MESSAGE_TIMEOUT,
  ZOOM_THRESHOLD,
  ZOOM_SCALE_FACTOR,
  CAMERA_UPDATE_INTERVAL,
} from "@/CONSTANTS";
import { scenarios } from "@/data";
import { remap, constrain } from "@/func/data";
import useSocketIo from "@/hooks/useSocketio";
import useMainStore from "@/stores/main";
import useUiStore from "@/stores/ui";
import { DisplayMode } from "@/types/data";
import { useEffect, useState } from "react";
import { useInterval, useTimeoutFn } from "react-use";

const allDefinedAndNotZero = (...args: Array<number | undefined>) => {
  return args.some((elem) => !!elem);
};

const parseModeAndYear = (val: number): [DisplayMode, number] => {
  if (val < 675) {
    return ["HISTORY", Math.floor(remap(val, 0, 675, 1950, 2010))];
  }

  if (val < 789) {
    return ["HISTORY", Math.floor(remap(val, 675, 789, 2010, 2023))];
  }

  return ["FUTURE", 2100];
};

const SocketAdapter = ({ topic }: { topic: string }) => {
  const [incrementTargetZoomFactor, setMove] = useUiStore((state) => [
    state.incrementTargetZoomFactor,
    state.setMove,
  ]);
  const [setTime, time, setScenario, setMode, mode] = useMainStore((state) => [
    state.setTime,
    state.time,
    state.setScenario,
    state.setMode,
    state.mode,
  ]);

  const { lastMessage } = useSocketIo({ topic });

  const [zoomDelta, setZoomingDelta] = useState(0);

  const [xDelta, setXDelta] = useState(0);
  const [yDelta, setYDelta] = useState(0);

  /* just in case no new messages for a relative move come in
  -> reset them after certain time */

  /* const [_isReady, _cancel, reset] = useTimeoutFn(() => {
    setXDelta(0);
    setYDelta(0);
    setZoomingDelta(0);
  }, MESSAGE_TIMEOUT); */

  const reset = () => {};

  useInterval(
    () => {
      if (zoomDelta) incrementTargetZoomFactor(zoomDelta);

      if (xDelta || yDelta) {
        const delta = { x: xDelta, y: yDelta };
        setMove(delta);
      }
    },
    allDefinedAndNotZero(zoomDelta, xDelta, yDelta)
      ? CAMERA_UPDATE_INTERVAL
      : null
  );

  useEffect(() => {
    if (!lastMessage) return;
    const { command, value } = lastMessage;

    switch (command) {
      case "z": {
        reset();
        if (Math.abs(value) > ZOOM_THRESHOLD) {
          setZoomingDelta(value * ZOOM_SCALE_FACTOR);
        } else {
          setZoomingDelta(0);
        }
        break;
      }

      case "h": {
        const [newMode, year] = parseModeAndYear(value);

        const newTime = Math.floor(year);
        if (time !== newTime) {
          setTime(Math.floor(year));
        }

        if (newMode !== mode) {
          setMode(newMode);
        }
        break;
      }

      case "x": {
        reset();
        if (Math.abs(value) > MOVEMENT_THRESHOLD) {
          setXDelta(value * MOVEMENT_SCALE_FACTOR);
        } else {
          setXDelta(0);
        }
        break;
      }

      case "y": {
        reset();
        if (Math.abs(value) > MOVEMENT_THRESHOLD) {
          setYDelta(value * MOVEMENT_SCALE_FACTOR);
        } else {
          setYDelta(0);
        }
        break;
      }

      case "s": {
        let scenario = constrain(value, 0, scenarios.length - 1);
        setScenario(Math.floor(scenario));
        break;
      }

      case "PING": {
        /* this is just a ping from the server */
        break;
      }
    }
  }, [lastMessage]);

  return null;
};

export default SocketAdapter;
