import { defineStore } from "pinia";
import { NameSpace } from "../nameSpace.model";
import {
  DiffType,
  Equipment,
  ExerciseDifficulty,
  Muscle,
} from "@/types/base.model";
import axiosInstance from "@/api";
import { RequestUrl } from "@/types/requestUrl.model";

interface State {
  muscleList: Muscle[];
  equipmentList: Equipment[];
}

interface Getters<T = State> {
  // Getter to return the list of exercises
  getMuscleList: (state: T) => Muscle[];
  getEquipmentList: (state: T) => Equipment[];
  [props: string]: (s: T) => any;
}

interface Actions {
  refreshData: () => Promise<void>;
}

export const directoryStore = defineStore<NameSpace, State, Getters, Actions>(
  NameSpace.Direcotry,
  {
    state: () => ({
      muscleList: [
        { id: 10, name: 'Cardio' },
        { id: 2, name: 'Chest' },
        { id: 4, name: 'Back' },
        { id: 1, name: 'Thighs' },
        { id: 6, name: 'Shoulders' },
        { id: 5, name: 'Upper Arms' },
        { id: 3, name: 'Hips' },
        { id: 12, name: 'Waist' },
        { id: 8, name: 'Calves' },
        { id: 7, name: 'Forearms' },
        { id: 9, name: 'Neck' },
        { id: 17, name: 'Biceps' },
        { id: 18, name: 'Triceps' },
        { id: 19, name: 'Quadriceps' },
        { id: 20, name: 'Hamstrings' }
      ],
      equipmentList: [
        { id: 1, name: 'Barbell' },
        { id: 2, name: 'Body weight' },
        { id: 3, name: 'Cable' },
        { id: 4, name: 'Dumbbell' },
        { id: 5, name: 'EZ Barbell' },
        { id: 6, name: 'Leverage machine' },
        { id: 7, name: 'Sled machine' },
        { id: 8, name: 'Smith machine' },
        { id: 9, name: 'Weighted' },
        { id: 10, name: 'Assisted' },
        { id: 11, name: 'Band' },
        { id: 12, name: 'Battling Rope' },
        { id: 13, name: 'Bosu ball' },
        { id: 14, name: 'Hammer' },
        { id: 15, name: 'Kettlebell' },
        { id: 16, name: 'Medicine Ball' },
        { id: 17, name: 'Olympic barbell' },
        { id: 18, name: 'Power Sled' },
        { id: 19, name: 'Resistance Band' },
        { id: 20, name: 'Roll' },
        { id: 21, name: 'Rollball' },
        { id: 22, name: 'Rope' },
        { id: 23, name: 'Stability ball' },
        { id: 24, name: 'Stick' },
        { id: 25, name: 'Suspension' },
        { id: 26, name: 'Trap bar' },
        { id: 27, name: 'Vibrate Plate' },
        { id: 28, name: 'Wheel roller' }
      ],
    }),
    getters: {
      getMuscleList: (state: State) => state.muscleList,
      getEquipmentList: (state: State) => state.equipmentList,
    },
    actions: {
      refreshData() {
        return Promise.all([
          axiosInstance.get(RequestUrl.Wiki_Muscles),
          axiosInstance.get(RequestUrl.Wiki_Equipments),
        ]).then(([muscleResponse, equipmentResponse]) => {
          this.muscleList = muscleResponse.data.results;
          this.equipmentList = equipmentResponse.data.results;
        });
      },
    } /* actions */,
  }
);
