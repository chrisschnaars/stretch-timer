import React from "react";
import { useRoutine } from "../hooks/useRoutine";

interface TimerFooterProps {
  routine: ReturnType<typeof useRoutine>;
}

const TimerFooter: React.FC<TimerFooterProps> = ({ routine }) => {
  const { currentIndex, stretches } = routine;

  return (
    <footer className="w-full max-w-md mt-auto space-y-6 pb-4">
      <div className="flex justify-center gap-2">
        {stretches.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-bg-accent" : "bg-bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="flex flex-col items-center">
        <div className="flex items-center">
          {currentIndex < stretches.length - 1 && (
            <p className="text-fg-muted text-sm font-medium">
              Next:{" "}
              <span className="text-fg-primary font-bold">
                {stretches[currentIndex + 1].name}
              </span>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};

export default TimerFooter;
