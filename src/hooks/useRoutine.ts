import { useState, useEffect, useCallback, useRef } from "react";
import type { Stretch } from "../types";
import { useRoutines } from "./useRoutines";

export const useRoutine = (routineId: string) => {
  const { getRoutine, updateRoutine: updateRoutineInStorage } = useRoutines();
  const routine = getRoutine(routineId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(routine?.duration || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const timerRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // If routine doesn't exist, return null values
  if (!routine) {
    return {
      name: "",
      stretches: [],
      duration: 0,
      restDuration: 0,
      currentStretch: undefined,
      currentIndex: 0,
      timeLeft: 0,
      isRunning: false,
      isResting: false,
      toggleTimer: () => {},
      resetTimer: () => {},
      nextStretch: () => {},
      previousStretch: () => {},
      skipToNext: () => {},
      updateStretches: () => {},
      updateDuration: () => {},
      updateRestDuration: () => {},
      updateName: () => {},
      setCurrentIndex: () => {},
    };
  }

  const { name, stretches, duration, restDuration } = routine;

  const currentStretch = stretches[currentIndex];

  const nextStretch = useCallback(() => {
    if (isResting) {
      // If we are resting, move to the next stretch
      if (currentIndex < stretches.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setIsResting(false);
        setTimeLeft(duration);
      } else {
        // End of routine
        setIsRunning(false);
        setIsResting(false);
        setCurrentIndex(0);
        setTimeLeft(duration);
      }
    } else {
      // If we are not resting, check if we should rest (but not after the last stretch)
      if (restDuration > 0 && currentIndex < stretches.length - 1) {
        setIsResting(true);
        setTimeLeft(restDuration);
      } else if (currentIndex < stretches.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setTimeLeft(duration);
      } else {
        // End of routine (no rest after final stretch)
        setIsRunning(false);
        setCurrentIndex(0);
        setTimeLeft(duration);
      }
    }
  }, [isResting, currentIndex, stretches.length, duration, restDuration]);

  const previousStretch = useCallback(() => {
    if (isResting) {
      // If resting, go back to the current stretch
      setIsResting(false);
      setTimeLeft(duration);
    } else if (currentIndex > 0) {
      // If not resting and not at the beginning, go back to previous rest or stretch
      if (restDuration > 0) {
        setCurrentIndex((prev) => prev - 1);
        setIsResting(true);
        setTimeLeft(restDuration);
      } else {
        setCurrentIndex((prev) => prev - 1);
        setTimeLeft(duration);
      }
    }
  }, [isResting, currentIndex, duration, restDuration]);

  const skipToNext = useCallback(() => {
    // Skip directly to the next stretch, bypassing rest periods
    if (currentIndex < stretches.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsResting(false);
      setTimeLeft(duration);
    } else {
      // End of routine
      setIsRunning(false);
      setIsResting(false);
      setCurrentIndex(0);
      setTimeLeft(duration);
    }
  }, [currentIndex, stretches.length, duration]);

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsResting(false);
    setCurrentIndex(0);
    setTimeLeft(duration);
  }, [duration]);

  const updateStretches = (newStretches: Stretch[]) => {
    updateRoutineInStorage(routineId, { stretches: newStretches });
    // If the current index is out of bounds after update, reset it
    if (currentIndex >= newStretches.length) {
      setCurrentIndex(0);
      setIsResting(false);
      setTimeLeft(duration);
      setIsRunning(false);
    }
  };

  const updateDuration = (newDuration: number) => {
    updateRoutineInStorage(routineId, { duration: newDuration });
    if (!isRunning && !isResting) {
      setTimeLeft(newDuration);
    }
  };

  const updateRestDuration = (newRestDuration: number) => {
    updateRoutineInStorage(routineId, { restDuration: newRestDuration });
    if (!isRunning && isResting) {
      setTimeLeft(newRestDuration);
    }
  };

  const updateName = (newName: string) => {
    updateRoutineInStorage(routineId, { name: newName });
  };

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

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          const nextValue = prev - 0.1;
          return nextValue > 0 ? nextValue : 0;
        });
      }, 100);
    } else if (timeLeft <= 0 && isRunning) {
      playBeep();
      // Use a timeout to move the state update to the next tick,
      // avoiding the "cascading render" lint error.
      setTimeout(nextStretch, 0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, nextStretch, playBeep]);

  return {
    name,
    stretches,
    duration,
    restDuration,
    currentStretch,
    currentIndex,
    timeLeft,
    isRunning,
    isResting,
    toggleTimer,
    resetTimer,
    nextStretch,
    previousStretch,
    skipToNext,
    updateStretches,
    updateDuration,
    updateRestDuration,
    updateName,
    setCurrentIndex: (idx: number) => {
      setCurrentIndex(idx);
      setIsResting(false);
      setTimeLeft(duration);
      setIsRunning(false);
    },
  };
};
