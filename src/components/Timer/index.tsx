import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useRoutine } from "../../hooks/useRoutine";
import Controls from "./Controls";
import Footer from "./Footer";
import Header from "./Header";
import Timer from "./Timer";
import TitleBlock from "./TitleBlock";
import Button from "../ui/Button";

const TimerView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const routine = useRoutine(id!);
  const [timerState, setTimerState] = useState<
    "ready" | "countdown" | "active"
  >("ready");
  const [countdown, setCountdown] = useState(3);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);
  const countdownIntervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

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
    toggleTimer,
    isRunning,
  } = routine;

  const playBeep = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }

    const ctx = audioCtxRef.current;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Create a gentle bell/chime with harmonics
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 - major chord

    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(freq, now);

      // Stagger the notes slightly for a more musical effect
      const startTime = now + i * 0.05;
      const volume = 0.15 - i * 0.03; // Decreasing volume for each harmonic

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + 1.5);
    });
  }, []);

  const playCountdownTick = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }

    const ctx = audioCtxRef.current;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Create a short, gentle tick sound
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(440, now); // A4 - lower, mellower tone

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.08, now + 0.02); // Softer and slower attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.25);
  }, []);

  // Reset to ready state when routine is reset
  useEffect(() => {
    if (
      !isRunning &&
      currentIndex === 0 &&
      !isFinished &&
      timerState !== "countdown" &&
      timerState !== "active"
    ) {
      setTimeout(() => {
        setTimerState("ready");
        setCountdown(3);
      }, 0);
    }
  }, [isRunning, currentIndex, isFinished, timerState]);

  // Handle countdown logic
  useEffect(() => {
    if (timerState === "countdown" && isCountdownRunning) {
      if (countdown > 0) {
        countdownIntervalRef.current = window.setTimeout(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);
      } else {
        // Countdown finished, play beep and start the routine
        playBeep();
        setTimeout(() => {
          setTimerState("active");
          setIsCountdownRunning(false);
          toggleTimer();
        }, 0);
      }
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearTimeout(countdownIntervalRef.current);
      }
    };
  }, [timerState, countdown, isCountdownRunning, toggleTimer, playBeep]);

  // Play tick sound on countdown numbers
  useEffect(() => {
    if (timerState === "countdown" && countdown > 0 && countdown <= 3) {
      playCountdownTick();
    }
  }, [timerState, countdown, playCountdownTick]);

  // If routine doesn't exist, redirect to home
  if (!id || (!currentStretch && !isFinished)) {
    return <Navigate to="/" replace />;
  }

  const handleStart = () => {
    setTimerState("countdown");
    setIsCountdownRunning(true);
  };

  const handleToggle = () => {
    if (timerState === "countdown") {
      setIsCountdownRunning((prev) => !prev);
    } else {
      toggleTimer();
    }
  };

  const handleReset = () => {
    resetTimer();
    setTimerState("ready");
    setCountdown(3);
    setIsCountdownRunning(false);
  };

  const handleSkip = () => {
    if (timerState === "countdown") {
      setTimerState("active");
      setCountdown(3);
      setIsCountdownRunning(false);
      toggleTimer();
    } else {
      routine.skipToNext();
    }
  };

  // Create a modified routine object with custom handlers
  const routineWithCustomHandlers = {
    ...routine,
    toggleTimer: handleToggle,
    resetTimer: handleReset,
    skipToNext: handleSkip,
    isRunning: timerState === "countdown" ? isCountdownRunning : isRunning,
  };

  const formatDuration = (totalSeconds: number) => {
    if (totalSeconds < 60) {
      return "less than a minute";
    }
    const roundedMinutes = Math.round(totalSeconds / 60);
    return `${roundedMinutes} ${roundedMinutes === 1 ? "min" : "mins"}`;
  };

  const totalDuration = stretches.length * duration;
  const totalWithRest = totalDuration + (stretches.length - 1) * restDuration;

  const currentDuration = isResting ? restDuration : duration;
  const progress = ((currentDuration - timeLeft) / currentDuration) * 100;
  const displayName = isResting ? "Rest" : currentStretch?.name || "";

  // Calculate display values for timer states
  const getTimerDisplay = () => {
    if (timerState === "countdown") {
      return {
        subheading: routine.name,
        heading: "Get Ready",
        timeValue: countdown,
        progressValue: ((3 - countdown) / 3) * 100,
      };
    }
    return {
      subheading: isResting
        ? "Rest Period"
        : `${currentIndex + 1} of ${stretches.length}`,
      heading: displayName,
      timeValue: timeLeft,
      progressValue: progress,
    };
  };

  const timerDisplay = getTimerDisplay();

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-fg-primary)] font-sans p-4 flex flex-col items-center">
      <Header routineName={routine.name} routineId={id} />

      <main className="w-full max-w-md flex-1 flex flex-col items-center justify-center py-4 space-y-12">
        {isFinished ? (
          <>
            <TitleBlock
              subheading={routine.name}
              heading="Finished!"
              className="animate-[fadeIn_0.3s_ease-in]"
            />

            <div className="flex flex-col gap-4 w-full max-w-xs animate-[fadeIn_0.5s_ease-in_0.2s_both]">
              <Button
                onClick={handleReset}
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
        ) : timerState === "ready" ? (
          <>
            <div className="text-center space-y-6 animate-[fadeIn_0.5s_ease-in]">
              <div className="space-y-2">
                <h2 className="heading-lg">{routine.name}</h2>
                <p className="text-xl text-[var(--color-fg-muted)]">
                  {stretches.length} stretch{stretches.length === 1 ? "" : "es"}{" "}
                  • {formatDuration(totalWithRest)}
                </p>
              </div>
            </div>

            <div className="w-full max-w-xs animate-[fadeIn_0.5s_ease-in_0.2s_both]">
              <Button onClick={handleStart} kind="primary" className="w-full">
                Start
              </Button>
            </div>
          </>
        ) : (
          <>
            <TitleBlock
              subheading={timerDisplay.subheading}
              heading={timerDisplay.heading}
            />

            <Timer
              timeLeft={timerDisplay.timeValue}
              progress={timerDisplay.progressValue}
              showProgress={timerState !== "countdown"}
              animateNumber={timerState === "countdown"}
            />

            <Controls routine={routineWithCustomHandlers} />
          </>
        )}
      </main>

      {!isFinished &&
        (timerState === "active" || timerState === "countdown") && (
          <Footer routine={routineWithCustomHandlers} />
        )}
    </div>
  );
};

export default TimerView;
