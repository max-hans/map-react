import { FC } from "react";

interface SliderProps {
  onChange: (v: number) => void;
  value: number;
  title: string;
  min: number;
  max: number;
}

const Slider: FC<SliderProps> = ({ onChange, value, title, min, max }) => {
  return (
    <div className="w-full">
      <div className="flex flex-row justify-between">
        <h3 className="font-bold">{title}</h3>
        <p className="italic">{value}</p>
      </div>
      <input
        className="w-full"
        type="range"
        min={min}
        max={max}
        step="1"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
      ></input>
    </div>
  );
};

export default Slider;
