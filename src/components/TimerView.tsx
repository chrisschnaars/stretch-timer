import React from "react";
import { useRoutine } from "../hooks/useRoutine";
import TimerControls from "./TimerControls";

interface TimerViewProps {
  routine: ReturnType<typeof useRoutine>;
}

const TimerView: React.FC<TimerViewProps> = ({ routine }) => {
  const { currentStretch, timeLeft, currentIndex, stretches, duration } =
    routine;

  if (!currentStretch)
    return (
      <div className="text-center py-20 text-fg-muted">
        No stretches in routine
      </div>
    );

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full space-y-12 py-10">
      <div className="text-center space-y-2">
        <p className="text-[var(--color-fg-muted)] text-sm font-semibold uppercase tracking-widest">
          {currentIndex + 1} of {stretches.length}
        </p>
        <h2 className="text-4xl font-extrabold tracking-tight text-[var(--color-fg-primary)]">
          {currentStretch.name}
        </h2>
      </div>

      <div className="relative flex items-center justify-center">
        {/* Large circular progress representation */}
        <div className="relative w-72 h-72 flex items-center justify-center">
          <svg className="absolute w-full h-full transform -rotate-90">
            <circle
              cx="144"
              cy="144"
              r="130"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-[var(--color-bg-muted)]"
            />
            <circle
              cx="144"
              cy="144"
              r="130"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 130}
              strokeDashoffset={2 * Math.PI * 130 * (1 - progress / 100)}
              strokeLinecap="round"
              className="text-[var(--color-bg-accent)] transition-all duration-100 ease-linear"
            />
          </svg>
          <div className="text-[var(--color-fg-primary)] text-8xl font-black tabular-nums tracking-tighter">
            {Math.ceil(timeLeft)}
          </div>
        </div>
      </div>

      <TimerControls routine={routine} />
    </div>
  );
};

export default TimerView;
