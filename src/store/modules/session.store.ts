import { defineStore } from "pinia";
import { NameSpace } from "../nameSpace.model";
import { Exercise, Session } from "@/tools/exercise.tool";
import { useExerciseStore } from "./exercise.store";
import { SessionExercise } from "@/types/session.model";
import axiosInstance from "@/api";
import { RequestUrl } from "@/types/requestUrl.model";

interface SessionState {
  id: number;
  sessionList: Session[];
  targetSession: Session | null; // Target session for editing or viewing details
}

interface SessionGetters<T = SessionState> {
  getSessionList(s: T): Session[]; // Getter to return the list of Sessions
  getTargetExcerciseList(s: T): Exercise[]; // Getter to return the list of exercises in the target session
  getShowExerciseData(s: T): SessionExercise[]; // Getter to return the list of exercises in the target session
  [props: string]: (s: T) => any;
}

interface SessionActions {
  startNewSession(id: number): void;
  terminateSession(): void; // Action to terminate the current session
  storeLastRunningSession(session: Session): void;
}

export const useSessionStore = defineStore<
  NameSpace,
  SessionState,
  SessionGetters,
  SessionActions
>(NameSpace.Session, {
  state: () => ({
    id: 0,
    sessionList: [],
    targetSession: null, // Initialize target session to null
  }),
  getters: {
    getSessionList: (s: SessionState) => {
      return s.sessionList; // Return the list of Sessions
    },
    getTargetExcerciseList: (s: SessionState) => {
      if (s.targetSession) {
        return s.targetSession.exerciseIds.map((id) => {
          return useExerciseStore().getExerciseById(id); // Find and return the exercise by ID
        });
      }
      return [];
    },
    getShowExerciseData: (s: SessionState) => {
      let exercises: Exercise<Date>[] = []; // Initialize an empty array for exercises
      if (s.targetSession) {
        exercises = s.targetSession.exerciseIds.map((id) => {
          return useExerciseStore().getExerciseById(id); // Find and return the exercise by ID
        });
      }

      if (exercises.length > 0) {
        const normalizedExercises: SessionExercise[] = [];
        const exerciseMap: Map<
          string,
          { endTime: Date; sets: Exercise[] }
        > = new Map();

        exercises.forEach((exercise) => {
          const key = `${exercise.name}`; // Use type and name as the unique key
          if (!exerciseMap.has(key)) {
            exerciseMap.set(key, {
              endTime: exercise.endTime, // Initialize end time
              sets: [exercise], // Add the first set
            });
          } else {
            const entry = exerciseMap.get(key)!;
            entry.endTime = exercise.endTime; // Update end time
            entry.sets.push(exercise); // Add the set
          }
        });

        exerciseMap.forEach((value, key) => {
          normalizedExercises.push({
            name: key, // Extract name
            lastEndTime: value.endTime,
            groups: value.sets,
          });
        });

        return normalizedExercises;
      }

      return [];
    },
  },
  actions: {
    startNewSession(id: number): void {
      const newSession = new Session(id); // Create a new Session
      this.targetSession = newSession; // Set the target session to the new session
    },
    terminateSession(): void {
      if (this.targetSession) {
        this.targetSession.endTime = new Date();
        this.sessionList.push(this.targetSession);
        
        axiosInstance.post(RequestUrl.Terminate_Session, {
          id: this.targetSession.id,
        });
        this.targetSession = null; // Reset target session to null
      }
    },
    storeLastRunningSession(session: Session): void {
      this.sessionList.push(session);
      this.targetSession = session;
    }
  },
  persist: {
    key: NameSpace.Session,
    storage: localStorage,
  },
});
