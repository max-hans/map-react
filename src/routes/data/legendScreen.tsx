import { FC } from "react";
import { MAX_WIND_SPEED } from "@/CONSTANTS";

interface LegendScreenProps {}

const LegendScreen: FC<LegendScreenProps> = () => {
  return (
    <div className="h-screen w-screen bg-white flex flex-col justify-center items-center">
      <div className="flex flex-col items-center space-y-8 w-1/2">
        <h2 className="font-bold text-2xl">Near-surface wind speed</h2>
        <div className="w-full h-8 bg-[url('/legend_dither.png')] bg-cover" />
        <div className="w-full border-l-2 border-r-2 h-4 border-black" />
        <div className="flex flex-row justify-between w-full">
          <p>0 km/h</p>
          <p>{MAX_WIND_SPEED} km/h</p>
        </div>
      </div>
    </div>
  );
};

export default LegendScreen;
