
export interface SessionExercise {
  name: string;
  lastEndTime: Date; // End time of the exercise, null if ongoing
  groups: SessionExerciseGroupItem[]; // List of exercise groups in the session
}

export interface SessionExerciseGroupItem {
 weight: number;
 repetitions: number;
}