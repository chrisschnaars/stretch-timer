import type { Stretch } from "./types";

export const DEFAULT_STRETCHES: Omit<Stretch, "id">[] = [
  { name: "Jumps", duration: 60 },
  { name: "Body Waves", duration: 60 },
  { name: "Arm Swings", duration: 60 },
  { name: "Trunk Twists", duration: 60 },
  { name: "Dead Arms", duration: 60 },
  { name: "Golf Swings", duration: 60 },
  { name: "Swing Step Backs", duration: 60 },
  { name: "Marches", duration: 60 },
  { name: "Ballerina Squats", duration: 60 },
  { name: "Chops", duration: 60 },
  { name: "Horse Stance", duration: 60 },
];
