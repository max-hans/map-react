import {
  getScenario,
  getTemperatureForScenario,
  getTemperatureForYear,
} from "@/data/temp";
import useMainStore from "@/stores/main";
import { FunctionComponent } from "react";

const formatTemp = (num: number, precision?: number): string => {
  const numString = precision ? num.toFixed(precision) : Math.floor(num);
  if (num >= 0) {
    return `+${numString}`;
  }
  return `${numString}`;
};

interface TitleProps {}

const Title: FunctionComponent<TitleProps> = () => {
  const [time, mode, scenario] = useMainStore((state) => [
    state.time,
    state.mode,
    state.scenario,
  ]);

  const currentScenario = getScenario(scenario);

  const temperature =
    mode === "HISTORY"
      ? getTemperatureForYear(time)
      : currentScenario.temperature ?? -1;

  const year = Math.floor(mode === "HISTORY" ? time : 2100);

  return (
    <div className="fixed w-screen h-screen bg-white flex flex-col justify-center items-center">
      <div className="flex flex-col space-y-8 items-center relative">
        <h2 className="text-4xl w-full text-center leading-tight">
          {mode === "FUTURE"
            ? `projection [ ${currentScenario.name} ]`
            : "historic data"}
        </h2>
        <h2 className="text-[200px] leading-tight w-full">
          {formatTemp(temperature, 2)} °C
        </h2>
        <h2 className="text-4xl leading-tight">year {year}</h2>
      </div>
    </div>
  );
};

export default Title;
