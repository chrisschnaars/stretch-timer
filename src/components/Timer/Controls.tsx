import React from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { useRoutine } from "../../hooks/useRoutine";
import Button from "../ui/Button";

interface ControlsProps {
  routine: ReturnType<typeof useRoutine>;
}

const Controls: React.FC<ControlsProps> = ({ routine }) => {
  return (
    <div className="flex justify-between items-center gap-8">
      <Button
        aria-label="Previous Stretch"
        onClick={routine.previousStretch}
        disabled={routine.currentIndex === 0}
        circular
        icon={SkipBack}
      />

      <Button
        aria-label="Toggle Timer"
        onClick={routine.toggleTimer}
        kind="primary"
        size="lg"
        circular
        icon={routine.isRunning ? Pause : Play}
      />

      <Button
        aria-label="Next Stretch"
        onClick={routine.nextStretch}
        circular
        icon={SkipForward}
      />
    </div>
  );
};

export default Controls;
