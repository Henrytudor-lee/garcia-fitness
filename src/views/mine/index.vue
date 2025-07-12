<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>我的</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="dark-bg">
      <div class="profile-section">
        <img class="avatar" :src="avatarUrl" alt="avatar" />
        <div class="username">{{ useMainStore().user_name }}</div>
      </div>
      <ion-list class="settings-list" lines="none">
        <ion-item button class="settings-item" @click="onLanguage">
          <ion-icon name="language-outline" slot="start" class="item-icon" />
          <ion-label>语言</ion-label>
          <ion-note slot="end" class="item-note">{{ language }}</ion-note>
        </ion-item>
        <ion-item button class="settings-item" @click="onBindPhone">
          <ion-icon name="call-outline" slot="start" class="item-icon" />
          <ion-label>绑定手机号</ion-label>
          <ion-note slot="end" class="item-note">{{ phone ? phone : '未绑定' }}</ion-note>
        </ion-item>
        <ion-item button class="settings-item" @click="onSettings">
          <ion-icon name="settings-outline" slot="start" class="item-icon" />
          <ion-label>设置</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/modules/main.store";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonIcon
} from "@ionic/vue";
import { ref } from "vue";

const avatarUrl = ref("/images/avatar.png");
const username = ref("未登录用户");
const language = ref("简体中文");
const phone = ref(""); // 绑定手机号后可赋值

const onLanguage = () => {
  // 语言切换逻辑
  alert("切换语言功能开发中");
};
const onBindPhone = () => {
  // 跳转绑定手机号页面
  alert("绑定手机号功能开发中");
};
const onSettings = () => {
  // 跳转设置页面
  alert("设置功能开发中");
};

</script>

<style scoped>
.dark-bg {
  --background: #18181c;
  background: #18181c;
  min-height: 100vh;
}

.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px 0 24px 0;
  background: rgba(35, 35, 43, 0.98);
  border-radius: 0 0 18px 18px;
  margin-bottom: 18px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #3b82f6;
  object-fit: cover;
  margin-bottom: 12px;
}

.username {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
}

.settings-list {
  background: transparent;
}

.settings-item {
  --background: transparent;
  background: transparent;
  color: #e0e0e0;
  margin-bottom: 2px;
  border-radius: 12px;
}

.item-icon {
  color: #3b82f6;
  font-size: 22px;
}

.item-note {
  color: #aaa;
  font-size: 14px;
}
</style>