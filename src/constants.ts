import type { Stretch } from "./types";

export const DEFAULT_STRETCHES: Omit<Stretch, "id">[] = [
  { name: "Jumps" },
  { name: "Body Waves" },
  { name: "Arm Swings" },
  { name: "Trunk Twists" },
  { name: "Dead Arms" },
  { name: "Golf Swings" },
  { name: "Chops" },
  { name: "Marches" },
  { name: "Ballerina Squats" },
  { name: "Horse Stance" },
];

export const DEFAULT_DURATION = 60;
export const DEFAULT_REST_DURATION = 0;
export const DEFAULT_ROUTINE_NAME = "Morning Stretches";
