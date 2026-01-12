export interface Stretch {
  id: string;
  name: string;
  duration: number; // in seconds
}

export interface RoutineState {
  stretches: Stretch[];
  currentIndex: number;
  isRunning: boolean;
  timeLeft: number;
}
