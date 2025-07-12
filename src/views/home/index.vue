<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" fixed-slot-placement="before">
      <!-- 新增模块 -->
      <div v-if="!useSessionStore().targetSession" class="p-4">
        <div class="bg-gray-800 text-gray-100 rounded-lg shadow-md p-4 text-center">
          <div class="text-lg font-bold mb-4">No workout records for today</div>
          <div class="text-sm mb-4">
            Starting to exercise can help you stay healthy and active!
          </div>
          <ion-button @click="startTraining" color="primary" expand="block">
            Start
          </ion-button>
        </div>
      </div>

      <div class="p-4 transition-all" v-else>
        <div class="bg-gray-800 text-gray-100 rounded-lg shadow-md p-4">
          <div class="flex justify-between items-center mb-2">
            <div class="text-lg font-bold">Current workout</div>

            <div class="text-sm text-gray-400">
              {{ formatDuration(sessionTime) }}
            </div>

            <ion-button @click="stopTrainning" size="small" color="warning" expand="block">
              Stop
            </ion-button>
            <ion-icon :icon="isExpanded ? chevronUpOutline : chevronDownOutline" class="text-gray-400 cursor-pointer"
              @click="toggleExpand"></ion-icon>
          </div>

          <div class="space-y-4" v-if="isExpanded">
            <div class="bg-gray-700 text-gray-200 rounded-lg shadow p-4"
              v-for="(exercise, index) in useSessionStore().getShowExerciseData" :key="index">
              <div class="flex justify-between items-center">
                <div>
                  <div class="font-bold flex items-center">
                    {{ exercise.name }}

                    <ion-badge class="ml-2 p-1">{{
                      exercise.groups.length
                    }}</ion-badge>
                  </div>
                  <div class="text-sm">
                    <span v-for="ex in exercise.groups">
                      {{ ex.weight }}kg x {{ ex.repetitions }} /
                    </span>
                  </div>
                </div>
                <div class="text-right text-sm text-gray-400">
                  <div>
                    {{
                      exercise.lastEndTime.toLocaleDateString &&
                      exercise.lastEndTime.toLocaleDateString()
                    }}
                  </div>
                  <div>
                    {{
                      exercise.lastEndTime.toLocaleTimeString &&
                      exercise.lastEndTime.toLocaleTimeString()
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="space-y-4" v-else-if="
            !isExpanded && useSessionStore().getShowExerciseData.length > 0
          ">
            <div class="bg-gray-700 text-gray-200 rounded-lg shadow p-4">
              <div class="flex justify-between items-center">
                <div>
                  <div class="font-bold flex items-center">
                    {{ useSessionStore().getShowExerciseData[0].name }}
                    <ion-badge class="ml-2 p-1">{{
                      useSessionStore().getShowExerciseData[0].groups.length
                    }}</ion-badge>
                  </div>
                  <div class="text-sm">
                    <span v-for="ex in useSessionStore().getShowExerciseData[0]
                      .groups">
                      {{ ex.weight }}kg x {{ ex.repetitions }} /
                    </span>
                  </div>
                </div>
                <div class="text-right text-sm text-gray-400">
                  <div>
                    {{
                      useSessionStore().getShowExerciseData[0].lastEndTime
                        .toLocaleDateString &&
                      useSessionStore().getShowExerciseData[0].lastEndTime.toLocaleDateString()
                    }}
                  </div>
                  <div>
                    {{
                      useSessionStore().getShowExerciseData[0].lastEndTime
                        ?.toLocaleTimeString &&
                      useSessionStore().getShowExerciseData[0].lastEndTime?.toLocaleTimeString()
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="space-y-4" v-else>记录第一个动作吧！</div>
        </div>
      </div>

      <WorkoutHistoryMode />

      <!-- 悬浮按钮 -->
      <ion-fab horizontal="end" vertical="bottom" slot="fixed" v-if="useSessionStore().targetSession">
        <ion-fab-button @click="openAddExerciseModal" color="success">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <!-- 弹框 -->
      <add-exercise-modal ref="addExerciseModal"></add-exercise-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { IonFab, IonFabButton, IonIcon, IonButton, IonBadge } from "@ionic/vue";
import { add, chevronUpOutline, chevronDownOutline } from "ionicons/icons";
import { useExerciseStore } from "@/store/modules/exercise.store";
import AddExerciseModal from "./components/AddExerciseModal.vue";
import { useSessionStore } from "@/store/modules/session.store";
import axiosInstance from "@/api";
import WorkoutHistoryMode from './components/WorkoutHistoryMode.vue'

import { RequestUrl } from "@/types/requestUrl.model";
import { useMainStore } from "@/store/modules/main.store";

const addExerciseModal = ref<InstanceType<typeof AddExerciseModal> | null>(
  null
);

let timer: NodeJS.Timeout | null = null;
let sessionTime = ref(0);

const isExpanded = ref(false);
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const openAddExerciseModal = () => {
  if (addExerciseModal.value) {
    addExerciseModal.value.open();
  }
};

const startTraining = async () => {
  try {
    const response = await axiosInstance.post(
      RequestUrl.Start_Session,
      {
        user_id: 2,
      }
    );
    if (response.data.success) {

      const sessionId = response.data.data.id;
      useSessionStore().startNewSession(sessionId);

      // 计时
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(() => {
        sessionTime.value += 1;
      }, 1000);
    }
  } catch (error) {
    console.error("Failed to start session:", error);
  }
};

const stopTrainning = () => {
  useSessionStore().terminateSession();
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  sessionTime.value = 0;
};

function formatDuration(timeInSeconds: number) {
  // 确保输入为有效数字，负数自动归零
  const totalSeconds = Math.max(0, Math.floor(Number(timeInSeconds)));

  // 计算时间分量
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // 补零函数
  const pad = (num: number) => String(num).padStart(2, "0");

  // 组合时间字符串
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

const getLastRunningSession = async () => {
  const response = await axiosInstance.get(RequestUrl.Get_Last_Running_Session, {
    params: {
      user_id: useMainStore().user_id
    }
  })
  if (response.data.success) {
    useSessionStore().storeLastRunningSession(response.data.data.session);
    useExerciseStore().setExerList(response.data.data.exercises);
  }
}

onMounted(() => {
  if (!useSessionStore().targetSession) {
    getLastRunningSession();
  }
})
</script>

<style scoped></style>
