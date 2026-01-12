import { useState, useEffect, useCallback, useRef } from "react";
import type { Stretch } from "../types";
import {
  DEFAULT_STRETCHES,
  DEFAULT_DURATION,
  DEFAULT_ROUTINE_NAME,
} from "../constants";

const STORAGE_KEY = "stretch-routine-v1";

export const useRoutine = () => {
  const [data, setData] = useState<{
    name: string;
    stretches: Stretch[];
    duration: number;
  }>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Handle migration from per-stretch duration to global duration if needed
      if (
        Array.isArray(parsed.stretches) &&
        parsed.duration !== undefined &&
        parsed.name !== undefined
      ) {
        return parsed;
      }
      // If it's the old format (just an array of stretches), convert it
      if (Array.isArray(parsed)) {
        return {
          name: DEFAULT_ROUTINE_NAME,
          stretches: parsed.map((s) => ({ id: s.id, name: s.name })),
          duration: parsed[0]?.duration || DEFAULT_DURATION,
        };
      }
      // Handle partial migration
      return {
        name: parsed.name || DEFAULT_ROUTINE_NAME,
        stretches: parsed.stretches || [],
        duration: parsed.duration || DEFAULT_DURATION,
      };
    }

    return {
      name: DEFAULT_ROUTINE_NAME,
      stretches: DEFAULT_STRETCHES.map((s) => ({
        ...s,
        id: crypto.randomUUID(),
      })),
      duration: DEFAULT_DURATION,
    };
  });

  const { name, stretches, duration } = data;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const currentStretch = stretches[currentIndex];

  const nextStretch = useCallback(() => {
    setCurrentIndex((prevIdx) => {
      if (prevIdx < stretches.length - 1) {
        const nextIdx = prevIdx + 1;
        setTimeLeft(duration);
        return nextIdx;
      } else {
        setIsRunning(false);
        setTimeLeft(duration);
        return 0;
      }
    });
  }, [stretches.length, duration]);

  const previousStretch = useCallback(() => {
    setCurrentIndex((prevIdx) => {
      if (prevIdx > 0) {
        const newIdx = prevIdx - 1;
        setTimeLeft(duration);
        return newIdx;
      }
      return prevIdx;
    });
  }, [duration]);

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(duration);
  }, [duration]);

  const updateStretches = (newStretches: Stretch[]) => {
    setData((prev) => ({ ...prev, stretches: newStretches }));
    // If the current index is out of bounds after update, reset it
    if (currentIndex >= newStretches.length) {
      setCurrentIndex(0);
      setTimeLeft(duration);
      setIsRunning(false);
    }
  };

  const updateDuration = (newDuration: number) => {
    setData((prev) => ({ ...prev, duration: newDuration }));
    if (!isRunning) {
      setTimeLeft(newDuration);
    }
  };

  const updateName = (newName: string) => {
    setData((prev) => ({ ...prev, name: newName }));
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
    currentStretch,
    currentIndex,
    timeLeft,
    isRunning,
    toggleTimer,
    resetTimer,
    nextStretch,
    previousStretch,
    updateStretches,
    updateDuration,
    updateName,
    setCurrentIndex: (idx: number) => {
      setCurrentIndex(idx);
      setTimeLeft(duration);
      setIsRunning(false);
    },
  };
};
