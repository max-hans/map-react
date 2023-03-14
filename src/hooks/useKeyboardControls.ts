import { useKeyPressEvent } from "react-use";
import useUiStore from "../stores/ui";

const useKeyboardControls = () => {
  const incrementTargetZoomFactor = useUiStore(
    (state) => state.incrementTargetZoomFactor
  );

  useKeyPressEvent("ArrowUp", () => {
    incrementTargetZoomFactor(0.5);
  });

  useKeyPressEvent("ArrowDown", () => {
    incrementTargetZoomFactor(-0.5);
  });
};

export default useKeyboardControls;
