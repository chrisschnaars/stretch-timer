import type { Stretch } from "./types";

export const DEFAULT_STRETCHES: Omit<Stretch, "id">[] = [
  { name: "Jumps" },
  { name: "Body Waves" },
  { name: "Arm Swings" },
  { name: "Trunk Twists" },
  { name: "Dead Arms" },
  { name: "Golf Swings" },
  { name: "Swing Step Backs" },
  { name: "Marches" },
  { name: "Ballerina Squats" },
  { name: "Chops" },
  { name: "Horse Stance" },
];

export const DEFAULT_DURATION = 60;
export const DEFAULT_ROUTINE_NAME = "My Routine";
