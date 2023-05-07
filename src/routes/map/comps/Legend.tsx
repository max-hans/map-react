import { MAX_WIND_SPEED } from "@/CONSTANTS";
import { FC } from "react";

interface LegendProps {}

const Legend: FC<LegendProps> = ({}) => {
  return (
    <div className="absolute left-0 top-0 m-16 bg-white p-4 space-y-4 w-96">
      <h2 className="font-bold text-2xl">Near-surface wind speed</h2>
      <div className="w-full h-8 bg-[url('/legend_dither.png')] bg-cover" />
      <div className="w-full border-l-2 border-r-2 h-4 border-black" />
      <div className="flex flex-row justify-between">
        <p>0 km/h</p>
        <p>{MAX_WIND_SPEED} km/h</p>
      </div>
    </div>
  );
};
export default Legend;
