import { MOVE_DELTA, YEARS_MIN, YEARS_MAX, ZOOM_DELTA } from "@/CONSTANTS";
import { scenarios } from "@/data";
import { remap, constrain } from "@/func/data";
import { directionToVector } from "@/func/socket";
import useSocketIo from "@/hooks/useSocketio";
import useMainStore from "@/stores/main";
import useUiStore from "@/stores/ui";
import { useEffect } from "react";

const SocketAdapter = ({ topic }: { topic: string }) => {
  const uiConfig = useUiStore();
  const mainStore = useMainStore();

  const { lastMessage } = useSocketIo({ topic });

  useEffect(() => {
    if (!lastMessage) return;
    const { command, value } = lastMessage;
    switch (command) {
      case "z": {
        if (value === 0) {
          uiConfig.incrementTargetZoomFactor(-ZOOM_DELTA);
        }
        if (value === 1) {
          uiConfig.incrementTargetZoomFactor(ZOOM_DELTA);
        }
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
