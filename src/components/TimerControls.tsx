import React from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { useRoutine } from "../hooks/useRoutine";

interface TimerControlsProps {
  routine: ReturnType<typeof useRoutine>;
}

const TimerControls: React.FC<TimerControlsProps> = ({ routine }) => {
  return (
    <div className="flex justify-between items-center gap-8">
      <button
        onClick={routine.previousStretch}
        className="p-3 hover:bg-neutral-100 rounded-full transition-colors"
        disabled={routine.currentIndex === 0}
      >
        <SkipBack
          size={28}
          className={routine.currentIndex === 0 ? "text-neutral-300" : ""}
        />
      </button>

      <button
        onClick={routine.toggleTimer}
        className="w-20 h-20 bg-bg-accent text-white flex items-center justify-center rounded-full hover:bg-bg-accent-hover transition-colors shadow-lg"
      >
        {routine.isRunning ? (
          <Pause size={32} fill="white" />
        ) : (
          <Play size={32} fill="white" className="ml-1" />
        )}
      </button>

      <button
        onClick={routine.nextStretch}
        className="p-3 hover:bg-neutral-100 rounded-full transition-colors"
      >
        <SkipForward size={28} />
      </button>
    </div>
  );
};

export default TimerControls;
