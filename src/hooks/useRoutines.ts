import { useState, useEffect, useCallback } from "react";
import type { Routine } from "../types";
import {
  DEFAULT_STRETCHES,
  DEFAULT_DURATION,
  DEFAULT_REST_DURATION,
  DEFAULT_ROUTINE_NAME,
} from "../constants";

const STORAGE_KEY = "stretch-routines-v2";
const OLD_STORAGE_KEY = "stretch-routine-v1";

const migrateFromOldFormat = (): Routine[] => {
  const oldData = localStorage.getItem(OLD_STORAGE_KEY);
  if (!oldData) return [];

  try {
    const parsed = JSON.parse(oldData);

    // Create a single routine from the old format
    const routine: Routine = {
      id: crypto.randomUUID(),
      name: parsed.name || DEFAULT_ROUTINE_NAME,
      stretches: Array.isArray(parsed.stretches)
        ? parsed.stretches
        : Array.isArray(parsed)
        ? parsed.map((s: { id: string; name: string }) => ({
            id: s.id,
            name: s.name,
          }))
        : DEFAULT_STRETCHES.map((s) => ({ ...s, id: crypto.randomUUID() })),
      duration: parsed.duration || DEFAULT_DURATION,
      restDuration: parsed.restDuration ?? DEFAULT_REST_DURATION,
    };

    // Save to new format and remove old key
    localStorage.setItem(STORAGE_KEY, JSON.stringify([routine]));
    localStorage.removeItem(OLD_STORAGE_KEY);

    return [routine];
  } catch (error) {
    console.error("Failed to migrate old routine data:", error);
    return [];
  }
};

export const useRoutines = () => {
  const [routines, setRoutines] = useState<Routine[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error("Failed to parse routines:", error);
      }
    }

    // Try to migrate from old format
    const migrated = migrateFromOldFormat();
    if (migrated.length > 0) {
      return migrated;
    }

    // Create default routine with default stretches
    const defaultRoutine: Routine = {
      id: crypto.randomUUID(),
      name: DEFAULT_ROUTINE_NAME,
      stretches: DEFAULT_STRETCHES.map((s) => ({
        ...s,
        id: crypto.randomUUID(),
      })),
      duration: DEFAULT_DURATION,
      restDuration: DEFAULT_REST_DURATION,
    };

    return [defaultRoutine];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
  }, [routines]);

  const getRoutine = useCallback(
    (id: string): Routine | undefined => {
      return routines.find((r) => r.id === id);
    },
    [routines]
  );

  const addRoutine = useCallback((routine: Omit<Routine, "id">) => {
    const newRoutine: Routine = {
      ...routine,
      id: crypto.randomUUID(),
    };
    setRoutines((prev) => [...prev, newRoutine]);
    return newRoutine;
  }, []);

  const updateRoutine = useCallback(
    (id: string, updates: Partial<Omit<Routine, "id">>) => {
      setRoutines((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
      );
    },
    []
  );

  const deleteRoutine = useCallback((id: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return {
    routines,
    getRoutine,
    addRoutine,
    updateRoutine,
    deleteRoutine,
  };
};
