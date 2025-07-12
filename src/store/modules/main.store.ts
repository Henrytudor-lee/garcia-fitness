import { defineStore } from "pinia";
import { NameSpace } from "../nameSpace.model";
import { Exercise, Session } from "@/tools/exercise.tool";
import { useExerciseStore } from "./exercise.store";
import { SessionExercise } from "@/types/session.model";
import axiosInstance from "@/api";
import { RequestUrl } from "@/types/requestUrl.model";

interface SessionState {
  user_id: number;
  user_name: string;
  user_avatar: string;
}

interface SessionGetters<T = SessionState> {

  [props: string]: (s: T) => any;
}

interface SessionActions {

}

export const useMainStore = defineStore<
  NameSpace,
  SessionState,
  SessionGetters,
  SessionActions
>(NameSpace.Main, {
  state: () => ({
    user_id: -1,
    user_name: '',
    user_avatar: '',
  }),
  getters: {

  },
  actions: {


  },
  persist: {
    key: NameSpace.Main,
    storage: localStorage,
  },
});
