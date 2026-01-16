import React from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { Menu, SquarePen } from "lucide-react";
import { useRoutine } from "../../hooks/useRoutine";
import Controls from "./Controls";
import Footer from "./Footer";
import Button from "../ui/Button";

const TimerView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const routine = useRoutine(id!);

  const {
    currentStretch,
    timeLeft,
    currentIndex,
    stretches,
    duration,
    restDuration,
    isResting,
    isFinished,
    resetTimer,
  } = routine;

  // If routine doesn't exist, redirect to home
  if (!id || (!currentStretch && !isFinished)) {
    return <Navigate to="/" replace />;
  }

  const currentDuration = isResting ? restDuration : duration;
  const progress = ((currentDuration - timeLeft) / currentDuration) * 100;
  const displayName = isResting ? "Rest" : currentStretch?.name || "";

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-fg-primary)] font-sans p-4 flex flex-col items-center">
      <header className="w-full max-w-md flex justify-between items-center pt-2">
        <Button
          onClick={() => navigate("/")}
          icon={Menu}
          size="sm"
          aria-label="Back to routines"
        />
        <h1 className="text-xl font-bold tracking-tight flex-1 text-center">
          {routine.name}
        </h1>
        <Button
          onClick={() => navigate(`/routine/${id}/edit`)}
          size="sm"
          aria-label="Edit routine"
          className="ml-auto"
          icon={SquarePen}
        />
      </header>

      <main className="w-full max-w-md flex-1 flex flex-col items-center justify-center py-4 space-y-12">
        {isFinished ? (
          <>
            <div className="text-center space-y-2 animate-[fadeIn_0.3s_ease-in]">
              <p className="text-[var(--color-fg-muted)] text-sm font-semibold uppercase tracking-widest">
                {routine.name}
              </p>
              <h2 className="text-4xl font-extrabold tracking-tight text-[var(--color-fg-primary)]">
                Finished!
              </h2>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-xs animate-[fadeIn_0.5s_ease-in_0.2s_both]">
              <Button
                onClick={resetTimer}
                kind="primary"
                size="md"
                className="w-full"
              >
                Restart
              </Button>
              <Button
                onClick={() => navigate("/")}
                kind="default"
                size="md"
                className="w-full"
              >
                See All Routines
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center space-y-2">
              <p className="text-[var(--color-fg-muted)] text-sm font-semibold uppercase tracking-widest">
                {isResting
                  ? "Rest Period"
                  : `${currentIndex + 1} of ${stretches.length}`}
              </p>
              <h2 className="text-4xl font-extrabold tracking-tight text-[var(--color-fg-primary)]">
                {displayName}
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

            <Controls routine={routine} />
          </>
        )}
      </main>

      {!isFinished && <Footer routine={routine} />}
    </div>
  );
};

export default TimerView;
