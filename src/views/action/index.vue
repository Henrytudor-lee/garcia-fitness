<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="openMuscleTypes">Muscles</ion-button>
        </ion-buttons>

        <ion-title>Library</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-segment scrollable :value="selectedEquipment"
          @ionChange="(e) => selectEquipmentChange(Number(e.detail.value))">
          <!-- <ion-segment-button :value="-1">
            <ion-label>All</ion-label>
          </ion-segment-button> -->
          <ion-segment-button :value="equipment.id" v-for="equipment in directoryStore().getEquipmentList">
            <ion-label>{{ equipment.name }}</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <!-- 动作列表网格 -->
      <div class="action-grid">
        <div v-for="action in actionList" :key="action.id" class="action-card" @click="showActionDetail(action)">
          <div class="action-image">
            <img :src="action.image_name" :alt="action.name">
          </div>
          <!-- <ion-button fill="clear" class="favorite-button" @click="toggleFavorite(action)">
            <ion-icon :icon="action.is_favorite ? heart : heartOutline"
              :color="action.is_favorite ? 'danger' : 'medium'"></ion-icon>
          </ion-button> -->
          <div class="action-name text-xs">{{ action.name }}</div>
        </div>
      </div>
    </ion-content>
    <sliding-menu ref="menu" width="200px">
      <div class="border-r overflow-y-auto">
        <ion-list>
          <ion-item v-for="muscle in directoryStore().getMuscleList" :key="muscle.id">
            <img :src="getImageUrl(muscle)" alt="">
            <ion-label :class="muscle.id === selectedMuscle ? 'selected' : ''" @click="selectMuscleChange(muscle)">{{
              muscle.name }}</ion-label>
          </ion-item>
        </ion-list>
      </div>
    </sliding-menu>

    <!-- 底部详情弹窗 -->
    <div class="detail-modal" :class="{ 'show': showDetail }">
      <div class="modal-content">
        <div class="flex justify-between items-center pl-4">
          {{ selectedAction?.name }}
          <ion-button fill="clear" @click="closeDetail">
            <ion-icon :icon="close"></ion-icon>
          </ion-button>
        </div>
        <div class="modal-body">
          <div class="video-container">
            <video 
              v-if="selectedAction"
              :src="selectedAction.video_file"
              controls
              autoplay
              loop
              playsinline
              webkit-playsinline
              x5-playsinline
              x5-video-player-type="h5"
              x5-video-player-fullscreen="false"
              x5-video-orientation="portraint"
              controlsList="nodownload nofullscreen"
              disablePictureInPicture
              @fullscreenchange="handleFullscreenChange"
              ref="videoPlayer"
            ></video>
          </div>
          <div class="detail-info">
            <!-- <h3>{{ selectedAction?.name }}</h3> -->
            <!-- <div class="info-item">
              <span class="label">器械：</span>
              <span>{{ getEquipmentName(selectedAction?.equipment_id) }}</span>
            </div>
            <div class="info-item">
              <span class="label">肌肉群：</span>
              <span>{{ getMuscleNames(selectedAction?.body_part_id) }}</span>
            </div>
            <div class="info-item">
              <span class="label">类型：</span>
              <span>{{ selectedAction?.exercise_type }}</span>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </ion-page>

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonMenu,
  IonButtons,
  IonMenuButton,
  IonList,
  IonItem,
  IonSegment,
  IonSegmentButton,
  IonButton,
  IonIcon,
  IonModal,
  IonLabel,
} from "@ionic/vue";
import { heart, heartOutline, close } from 'ionicons/icons';
import { directoryStore } from "@/store/modules/exerciseeList.store";
import { Equipment, Muscle, ExerciseModel } from "@/types/base.model";
import SlidingMenu from "@/components/SlidingMenu.vue";
import { Exercise } from "@/tools/exercise.tool";
import axios from "axios";
import axiosInstance from "@/api";

const selectedMuscle = ref(10);
const menu = ref<InstanceType<typeof SlidingMenu> | null>(null);
const selectedEquipment = ref<number>(2);
const selectMuscleChange = (muscle: Muscle) => {
  selectedMuscle.value = muscle.id;

  updateActionList();
  menu.value?.close(); // 关闭左侧菜单
}

const selectEquipmentChange = (equipmentId: number) => {
  selectedEquipment.value = equipmentId;
  updateActionList();

}

const actionList = ref<ExerciseModel[]>([]);
const updateActionList = () => {
  if (selectedEquipment.value === -1) {
    // actionList.value = directoryStore().getActionList;
  } else {
    // actionList.value = directoryStore().getActionList.filter(action => action.equipmentId === selectedEquipment.value);
    axiosInstance.get(`/api/exercise/query`, {
      params: {
        equipment_id: selectedEquipment.value,
        body_part_id: selectedMuscle.value
      }
    }).then(res => {
      actionList.value = res.data.data;
    })

  }
}

const showDetail = ref(false);
const selectedAction = ref<ExerciseModel | null>(null);

const showActionDetail = (action: ExerciseModel) => {
  selectedAction.value = action;
  showDetail.value = true;
};

const closeDetail = () => {
  showDetail.value = false;
  selectedAction.value = null;
};

const openMuscleTypes = () => {
  menu.value?.open();
};

const toggleFavorite = (action: ExerciseModel) => {
  action.is_favorite = !action.is_favorite;
  // TODO: 更新到 store
};

const getImageUrl = (muscle: Muscle) => {
  let iconName = muscle.name.toLowerCase();
  if (iconName === 'upper arms') {
    iconName = 'biceps';
  } else if (iconName === 'thighs') {
    iconName = 'quadriceps';
  }
  return `/icon/${iconName}.svg`;
};

const getEquipmentName = (id: number | undefined) => {
  if (!id) return '';
  const equipment = directoryStore().getEquipmentList.find(e => e.id === id);
  return equipment?.name || '';
};

const getMuscleNames = (ids: number[] | undefined) => {
  if (!ids) return '';
  return ids.map(id => {
    const muscle = directoryStore().getMuscleList.find(m => m.id === id);
    return muscle?.name || '';
  }).join('、');
};

const videoPlayer = ref<HTMLVideoElement | null>(null);

const handleFullscreenChange = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
};

onMounted(() => {
  updateActionList();
})
</script>

<style scoped>
ion-segment {
  --background: var(--ion-color-light);
}

ion-segment-button {
  min-width: 80px;
}

.selected {
  color: var(--ion-color-primary);
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 12px;
  overflow-y: auto;
}

.action-card {
  background: var(--ion-color-light);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  aspect-ratio: 0.8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.action-card:active {
  transform: scale(0.98);
}

.action-image {
  position: relative;
  width: 100%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ion-color-light-shade);
}

.action-image img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}

.favorite-button {
  position: absolute;
  top: 8px;
  right: 8px;
  --padding-start: 0;
  --padding-end: 0;
  --background: rgba(255, 255, 255, 0.8);
  --border-radius: 50%;
  width: 32px;
  height: 32px;
}

.action-name {
  height: 20%;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: var(--ion-color-dark);
  white-space: normal;
  word-break: break-word;
  line-height: 1.2;
}

.detail-modal {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 37vh;
  background: var(--ion-color-light);
  border-radius: 16px 16px 0 0;
  transform: translateY(100%);
  transition: transform 0.3s ease-out;
  z-index: 1000;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

.detail-modal.show {
  transform: translateY(0);
}

.modal-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 8px;
  display: flex;
  justify-content: flex-end;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px;
}

.video-container {
  width: 100%;
  aspect-ratio: 16/9;
  background: var(--ion-color-dark);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  position: relative;
}

.video-container video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: relative;
  z-index: 1;
}

.video-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  pointer-events: none;
}

.detail-info {
  padding: 0 8px;
}

.detail-info h3 {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.info-item {
  margin-bottom: 12px;
  font-size: 14px;
}

.info-item .label {
  color: var(--ion-color-medium);
  margin-right: 8px;
}
</style>
