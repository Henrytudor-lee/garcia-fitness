import { useExerciseStore } from "@/store/modules/exercise.store";

export class Session {
  id: number; // Unique identifier for the session
  startTime: Date; // Start time of the session
  endTime: Date | null; // End time of the session, null if session is ongoing
  exerciseIds: number[]; // List of exercise IDs included in the session

  constructor(id: number) {
    this.id = id; // Generate a unique ID based on timestamp
    this.startTime = new Date(); // Set the start time to the current date and time
    this.endTime = null;
    this.exerciseIds = [];
  }

  addExercise(exerciseId: number): void {
    this.exerciseIds.push(exerciseId); // Add an exercise ID to the session
  }

  endSession(endTime: Date): void {
    this.endTime = endTime; // Set the end time of the session
  }
}

export class Exercise<T extends Date | string = Date> {
  id: number; // Unique identifier for the exercise
  name: string;
  weight: number; // Weight used for the exercise
  repetitions: number;
  endTime: T; // End time of the exercise, null if ongoing
  exerciseId: number;
  constructor(
    name: string,
    weight: number,
    repetitions: number,
    endTime: T,
    id: number,
    exerciseId: number
  ) {
    this.id = id; // Generate a unique ID for each exercise
    this.name = name;
    this.weight = weight; // Weight used for the exercise
    this.repetitions = repetitions;
    this.endTime = endTime; // Set the end time to the current date and time
    this.exerciseId = exerciseId;
  }
}
