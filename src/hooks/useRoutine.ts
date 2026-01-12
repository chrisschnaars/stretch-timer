import { useState, useEffect, useCallback, useRef } from 'react';
import type { Stretch } from '../types';
import { DEFAULT_STRETCHES } from '../constants';

const STORAGE_KEY = 'stretch-routine-v1';

export const useRoutine = () => {
  const [stretches, setStretches] = useState<Stretch[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);

    return DEFAULT_STRETCHES.map((s) => ({
      ...s,
      id: crypto.randomUUID(),
    }));
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(stretches[0]?.duration || 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stretches));
  }, [stretches]);

  const currentStretch = stretches[currentIndex];

  const nextStretch = useCallback(() => {
    if (currentIndex < stretches.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setTimeLeft(stretches[nextIdx].duration);
    } else {
      setIsRunning(false);
      setCurrentIndex(0);
      setTimeLeft(stretches[0].duration);
    }
  }, [currentIndex, stretches]);

  const previousStretch = useCallback(() => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setTimeLeft(stretches[prevIdx].duration);
    }
  }, [currentIndex, stretches]);

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(stretches[currentIndex].duration);
  }, [currentIndex, stretches]);

  const updateStretches = (newStretches: Stretch[]) => {
    setStretches(newStretches);
    // If the current index is out of bounds after update, reset it
    if (currentIndex >= newStretches.length) {
      setCurrentIndex(0);
      setTimeLeft(newStretches[0]?.duration || 60);
      setIsRunning(false);
    }
  };

  const playBeep = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }

    const audioCtx = audioCtxRef.current;

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
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
      nextStretch();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, nextStretch, playBeep]);

  return {
    stretches,
    currentStretch,
    currentIndex,
    timeLeft,
    isRunning,
    toggleTimer,
    resetTimer,
    nextStretch,
    previousStretch,
    updateStretches,
    setCurrentIndex: (idx: number) => {
        setCurrentIndex(idx);
        setTimeLeft(stretches[idx].duration);
        setIsRunning(false);
    }
  };
};
