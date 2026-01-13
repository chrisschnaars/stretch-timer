import React from "react";

interface SliderInputProps {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
}

const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  className = "",
}) => {
  return (
    <div className={`space-y-4 w-full ${className}`}>
      <div className="flex justify-between items-center">
        {label && <label className="block text-sm font-semibold">{label}</label>}
        <span className="text-lg font-bold text-[var(--color-bg-accent)]">
          {value}s
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-[var(--color-bg-muted)] rounded-lg appearance-none cursor-pointer accent-[var(--color-bg-accent)]"
      />
    </div>
  );
};

export default SliderInput;
