<template>
  <!-- 弹框 -->
  <ion-modal :is-open="isModalOpen" @did-dismiss="closeModal">
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Add Exercise</ion-title>
          <ion-buttons slot="start">
            <ion-button @click="openMuscleTypes">Muscles</ion-button>
          </ion-buttons>
          <ion-buttons slot="end">
            <ion-button @click="closeModal">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content>
        <div class="flex h-full">
          <!-- 右侧：器械类型和训练动作 -->
          <div class="w-screen flex flex-col">
            <!-- 器械类型 Tab 页签 -->
            <ion-segment v-model="selectedEquipmentType" scrollable @ion-change="updateActionsData">
              <ion-segment-button v-for="equipment in directoryStore().equipmentList" :key="equipment.id"
                :value="equipment.id">
                {{ equipment.name }}
              </ion-segment-button>
            </ion-segment>

            <!-- 训练动作模块 -->
            <div class="flex-1 overflow-y-auto grid grid-cols-3 auto-rows-[1fr] gap-2">
              <div v-for="action in actions" class="pb-1 rounded aspect-square">
                <div :key="action.name"
                  class="border h-full justify-between bg-gray-600 rounded flex flex-col hover:bg-sky-700 items-center cursor-pointer w-full h-full"
                  :class="{ selected: selectedAction === action.id }" @click="actionClick(action)">
                  <div class="w-16 h-24">
                    <img preload="metadata" loop="true" playsinline webkit-playsinline muted autoplay
                      :src="action.image_name" class="rounded-lg w-full h-full min-w-16 min-h-24" role="none"></img>
                  </div>
                  <div class="text-center">
                    <div class="font-bold text-xs">{{ action.name }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ion-content>

      <!-- 底部固定确认模块 -->
      <ion-footer>
        <div class="flex items-center justify-between p-4">
          <span>History Max:</span>
          <ion-button color="success" size="small" expand="block" @click="exerciseWeight = historyInfo.maxWeight">{{ historyInfo.maxWeight }}</ion-button>kg
          <span>Reps:</span>
          <ion-button color="success" size="small" expand="block" @click="exerciseReps = historyInfo.maxReps">{{ historyInfo.maxReps }}</ion-button>
        </div>
        <div class="p-4 space-y-4 flex gap-x-4">
          <!-- 动作个数 -->
          <ion-input v-model.number="exerciseReps" type="number" label="Count" label-placement="floating"></ion-input>
          <div class="flex flex-col gap-y-1">
            <ion-button color="success" size="small" expand="block" @click="exerciseReps += 5">+5</ion-button>
            <ion-button color="" size="small" expand="block" @click="exerciseReps -= 5">-5</ion-button>
          </div>

          <!-- 动作重量 -->
          <ion-input v-model.number="exerciseWeight" type="number" label="Weight"
            label-placement="floating"></ion-input>
          <ion-label slot="end"> &nbsp; kg</ion-label>
          <div class="flex flex-col gap-y-1">
            <ion-button color="success" size="small" expand="block" @click="exerciseWeight += 5">+5</ion-button>
            <ion-button color="" size="small" expand="block" @click="exerciseWeight -= 5">-5</ion-button>

          </div>

          <!-- 确认按钮 -->
          <ion-button class="h-16" size="small" expand="block" @click="submitExercise">Confirm</ion-button>
        </div>
      </ion-footer>
    </ion-page>
    <sliding-menu ref="menu" width="300px">
      <div class="border-r overflow-y-auto">
        <ion-list>
          <ion-item v-for="muscle in directoryStore().muscleList" :key="muscle.id" button
            @click="selectMuscle(muscle.id)" :class="{ selected: selectedMuscle === muscle.id }">
            <img :src="getImageUrl(muscle)" alt="">
            <ion-label>{{ muscle.name }}</ion-label>
          </ion-item>
        </ion-list>
      </div>
    </sliding-menu>
  </ion-modal>
</template>

<script setup lang="ts">
import axiosInstance from "@/api";
import { useExerciseStore } from "@/store/modules/exercise.store";
import { directoryStore } from "@/store/modules/exerciseeList.store";
import { useSessionStore } from "@/store/modules/session.store";
import { ExerciseModel, Muscle } from "@/types/base.model";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonInput,
  IonFooter,
} from "@ionic/vue";
import SlidingMenu from "@/components/SlidingMenu.vue";
import { ref, watch } from "vue";
import { queryExercises } from '@/api/exercise';



const isModalOpen = ref(false);

const menu = ref<InstanceType<typeof SlidingMenu> | null>(null);
const actions = ref<ExerciseModel[]>([]);

const selectedMuscle = ref(1);
const selectedEquipmentType = ref(1);
const selectedAction = ref(-1);

const exerciseReps = ref(0);
const exerciseWeight = ref(0);

const historyInfo = ref({
  maxWeight: 0,
  maxReps: 0,
});

const getImageUrl = (muscle: Muscle) => {
  let iconName = muscle.name.toLowerCase();
  if (iconName === 'upper arms') {
    iconName = 'biceps';
  } else if (iconName === 'thighs') {
    iconName = 'quadriceps';
  }
  return `/icon/${iconName}.svg`;
};

const selectMuscle = (id: number) => {
  selectedMuscle.value = id;
  menu.value?.close(); // 关闭左侧菜单
  // 根据选中的肌肉类型过滤动作列表
  updateActionsData();
};

const updateActionsData = async () => {
  try {
    const response = await queryExercises({
      body_part_id: selectedMuscle.value,
      equipment_id: selectedEquipmentType.value
    });
    if (response.data.success && response.data.data) {
      actions.value = response.data.data;
      if (response.data.data.length > 0) {
        selectedAction.value = response.data.data[0].id;
      }
    } else {
      console.error('获取运动数据失败:', response.data.error);
      // 这里可以添加错误提示
    }
  } catch (error) {
    console.error('获取运动数据失败:', error);
  }
};

const actionClick = (action: ExerciseModel) => {
  selectedAction.value = action.id;
}

const submitExercise = () => {
  const targetAction = actions.value.find(
    (item) => item.id == selectedAction.value
  );
  if (!targetAction) {
    return;
  }

  closeModal();
  useExerciseStore().addExercise(
    targetAction.name,
    targetAction.equipment_id,
    targetAction.body_part_id.join(","),
    exerciseWeight.value,
    exerciseReps.value,
    targetAction.id
  ).then(id => {
    useSessionStore().targetSession?.exerciseIds.push(id);
  });
};

const openMuscleTypes = () => {
  menu.value?.open();
};

const closeModal = () => {
  isModalOpen.value = false;
};

watch(
  () => selectedAction.value,
  async (newValue) => {
    // 根据选择的动作去查询历史最大训练重量
    try {
      const response = await axiosInstance.get("/api/exercise/getMaxWeightRecord", {
        params: { exercise_id: newValue }
      });
      if (response.data.success) {
        const record = response.data.data;
        if (record && Object.keys(record).length > 0) {
          // 假设返回记录中包含 weight 和 reps 字段
          historyInfo.value.maxWeight = record.weight;
          historyInfo.value.maxReps = record.reps || 0;
        } else {
          historyInfo.value.maxWeight = 0;
          historyInfo.value.maxReps = 0;
        }
      } else {
        historyInfo.value.maxWeight = 0;
        historyInfo.value.maxReps = 0;
      }
    } catch (error) {
      console.error("查询历史最大训练重量失败:", error);
      historyInfo.value.maxWeight = 0;
      historyInfo.value.maxReps = 0;
    }

  }
);

defineExpose({
  open: () => {
    isModalOpen.value = true;

    if (selectedAction.value >= 0) {
      return;
    }
    // 如果已经打开，则不重新加载数据
    updateActionsData();
  },
});
</script>

<style scoped>
.selected {
  background-color: #1e5e27;
}
</style>
