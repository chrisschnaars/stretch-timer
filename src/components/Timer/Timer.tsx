import React from "react";

interface TimerProps {
  timeLeft: number;
  progress: number;
  showProgress?: boolean;
  animateNumber?: boolean;
}

const Timer: React.FC<TimerProps> = ({
  timeLeft,
  progress,
  showProgress = true,
  animateNumber = false,
}) => {
  return (
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
          {showProgress && (
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
          )}
        </svg>
        <div
          key={animateNumber ? timeLeft : undefined}
          className={`text-[var(--color-fg-primary)] text-8xl font-black tabular-nums tracking-tighter ${
            animateNumber ? "animate-[fadeIn_0.3s_ease-in]" : ""
          }`}
        >
          {Math.ceil(timeLeft)}
        </div>
      </div>
    </div>
  );
};

export default Timer;
