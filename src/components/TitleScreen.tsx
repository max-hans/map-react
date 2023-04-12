import { FC, useEffect, useRef, useState } from "react";
import { Project } from "../types/data";
import useMainStore from "@/stores/main";
import { useFirstMountState, useTimeoutFn } from "react-use";

interface TitleScreenProps {
  temperature: number;
  time: number;
}

const TitleScreen: FC<TitleScreenProps> = ({ temperature, time }) => {
  const isFirstMount = useFirstMountState();

  const [open, setOpen] = useState(false);
  const [tempData, setTempData] = useState({ temperature: -1, time: -1 });

  const [_isReady, cancel, reset] = useTimeoutFn(() => setOpen(false), 1000);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFirstMount) return;
    setTempData(() => ({ time, temperature }));
    setOpen(true);
    reset();
    return cancel;
  }, [temperature, time]);

  return (
    <div
      className={`absolute top-0 w-1/2 left-1/4 h-1/6 bg-white p-4 flex flex-col space-y-4
	transition-all ${open ? "" : "-translate-y-full"}`}
      ref={ref}
    >
      <div className="w-full h-full flex flex-col space-y-2 overflow-hidden justify-center items-center">
        <h2 className="text-4xl">{tempData.temperature.toFixed(1)} °C</h2>
        <h2 className="text-sm">year: {Math.floor(tempData.time)}</h2>
      </div>
    </div>
  );
};

export default TitleScreen;
