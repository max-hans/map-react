import { getTemperatureForScenario, getTemperatureForYear } from "@/data/temp";
import useMainStore from "@/stores/main";
import { animated, useSpring } from "@react-spring/web";
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

  const temperature =
    mode === "HISTORY"
      ? getTemperatureForYear(time)
      : getTemperatureForScenario(scenario);

  const yearRaw = Math.floor(mode === "HISTORY" ? time : 2100);

  const { year } = useSpring({ year: yearRaw });

  return (
    <div className="fixed w-screen h-screen bg-white flex flex-col justify-center items-center">
      <div className="flex flex-col space-y-32 items-center relative">
        <h2 className="text-[200px] w-full">{formatTemp(temperature, 2)} °C</h2>
        <h2 className="absolute top-[100%] text-4xl">
          year: {year.isAnimating ? "yes" : "no"}
        </h2>
      </div>
    </div>
  );
};

export default Title;
