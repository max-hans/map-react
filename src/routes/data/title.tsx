import { getTemperatureForYear } from "@/data/temp";
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
  const [time] = useMainStore((state) => [state.time]);

  const temperature = getTemperatureForYear(time);
  console.log(time, temperature);
  return (
    <div className="fixed w-screen h-screen bg-white flex flex-col justify-center items-center">
      <div className="flex flex-col space-y-24 items-center relative">
        <h2 className="text-[200px] w-full">{formatTemp(temperature, 2)} °C</h2>
        <h2 className="absolute top-[100%] text-4xl">
          year: {Math.floor(time)}
        </h2>
      </div>
    </div>
  );
};

export default Title;
