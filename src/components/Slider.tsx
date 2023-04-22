import { FC } from "react";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValue: (v: number) => void;
  value: number;
  title: string;
  min: number;
  max: number;
  useFloat?: boolean;
}

const Slider: FC<SliderProps> = ({
  onValue,
  value,
  title,
  useFloat = false,
  ...rest
}) => {
  return (
    <div className="w-full">
      <div className="flex flex-row justify-between">
        <h3 className="font-bold">{title}</h3>
        <p className="italic">
          {useFloat ? value.toFixed(1) : Math.floor(value)}
        </p>
      </div>
      <input
        className="w-full"
        type="range"
        value={value}
        onChange={(e) => onValue(parseFloat(e.target.value))}
        step={0.1}
        {...rest}
      ></input>
    </div>
  );
};

export default Slider;
