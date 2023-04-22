import {
  MOVE_DELTA,
  YEARS_MIN,
  YEARS_MAX,
  ZOOM_DELTA,
  ZOOM_FRAME_DELTA,
  ZOOM_INTERVAL,
} from "@/CONSTANTS";
import { scenarios } from "@/data";
import { remap, constrain } from "@/func/data";
import { directionToVector } from "@/func/socket";
import useSocketIo from "@/hooks/useSocketio";
import useMainStore from "@/stores/main";
import useUiStore from "@/stores/ui";
import { useEffect, useState } from "react";
import { useInterval } from "react-use";

const SocketAdapter = ({ topic }: { topic: string }) => {
  const uiConfig = useUiStore();
  const mainStore = useMainStore();

  const { lastMessage } = useSocketIo({ topic });

  const [zoomDelta, setZoomingDelta] = useState(0);

  useInterval(() => {
    if (!zoomDelta) return;
    uiConfig.incrementTargetZoomFactor(zoomDelta);
  }, ZOOM_INTERVAL);

  useEffect(() => {
    if (!lastMessage) return;
    const { command, value } = lastMessage;
    switch (command) {
      case "z": {
        setZoomingDelta(ZOOM_FRAME_DELTA * value);
        break;
      }

      case "n": {
        let direction = directionToVector(value, MOVE_DELTA);
        console.log(direction);

        uiConfig.setMove(direction);
        break;
      }

      case "h": {
        let year = constrain(
          remap(value, 0, 1000, YEARS_MIN, YEARS_MAX),
          YEARS_MIN,
          YEARS_MAX
        );
        mainStore.setTime(year);
        break;
      }

      case "s": {
        let scenario = constrain(value, 0, scenarios.length - 1);
        mainStore.setScenario(scenario);
        break;
      }
    }
  }, [lastMessage]);

  return null;
};

export default SocketAdapter;
