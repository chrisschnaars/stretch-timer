export interface Stretch {
  id: string;
  name: string;
}

export interface Routine {
  id: string;
  name: string;
  stretches: Stretch[];
  duration: number;
  restDuration: number;
}

export interface RoutineState {
  name: string;
  stretches: Stretch[];
  currentIndex: number;
  isRunning: boolean;
  timeLeft: number;
  duration: number;
  restDuration: number;
}
