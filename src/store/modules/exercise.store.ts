import { defineStore } from "pinia";
import { NameSpace } from "../nameSpace.model";
import { Exercise } from "@/tools/exercise.tool";
import axiosInstance from "@/api";
import { RequestUrl } from "@/types/requestUrl.model";
import { useSessionStore } from "./session.store";

interface ExerciseState {
  id: number;
  exerList: Exercise<Date>[];
}

interface ExerciseGetters<T = ExerciseState> {
  getExerList(s: T): Exercise[]; // Getter to return the list of exercises
  [props: string]: (s: T) => any;
}

interface ExerciseActions {
  addExercise(
    name: string,
    equipId: number,
    muscleIds: string,
    weight: number,
    repetitions: number,
    exerciseId: number
  ): Promise<number>;
  clearList(): void;
  getExerciseById(id: number): Exercise<Date>; // Action to get an exercise by ID
  setExerList(exerList: Exercise<string>[]): void;
}

export const useExerciseStore = defineStore<
  NameSpace,
  ExerciseState,
  ExerciseGetters,
  ExerciseActions
>(NameSpace.Exercise, {
  state: () => ({
    id: 0,
    exerList: [],
  }),
  getters: {
    getExerList: (s: ExerciseState) => {
      return s.exerList; // Return the list of exercises
    },
  },
  actions: {
    addExercise(
      name: string,
      equipId: number,
      muscleIds: string,
      weight: number,
      repetitions: number,
      exerciseId: number
    ) {
      const newExId = ++this.id;
      const newExercise = new Exercise(
        name,
        weight,
        repetitions,
        new Date(),
        newExId,
        exerciseId
      ); // Create a new exercise

      const sequence = useSessionStore().targetSession?.exerciseIds.length || 0;
      return new Promise((resolve) => {
        axiosInstance.post(RequestUrl.Create_Exercise, {
          session_id: useSessionStore().targetSession?.id,
          name: name,
          weight: weight,
          reps: repetitions,
          sequence,
          exercise_id: exerciseId,
          user_id: 2
        })
          .then((res) => {
            newExercise.id = res.data.data.id;
            this.exerList.push(newExercise); // Add the exercise to the list
            resolve(res.data.data.id);
          });
      })
    },
    clearList() {
      this.exerList = []; // Clear the list of exercises
    },
    getExerciseById(id: number) {
      const targetEx = this.exerList.find((exercise) => exercise.id === id);
      if (typeof targetEx?.endTime === "string") {
        targetEx.endTime = new Date(targetEx.endTime); // Convert endTime to Date if it's a string
      }
      return this.exerList.find((exercise) => exercise.id === id) as Exercise<Date>; // Find and return the exercise by ID
    },
    setExerList(exerList: Exercise<string>[]) {
      this.exerList = exerList.map((exercise) => {
        return new Exercise(
          exercise.name,
          exercise.weight,
          exercise.repetitions,
          new Date(exercise.endTime),
          exercise.id,
          exercise.exerciseId
        ); // Map the list of exercises to the Exercise class
      });
    }
  },
  persist: {
    key: NameSpace.Exercise,
    storage: localStorage,
  },
});
