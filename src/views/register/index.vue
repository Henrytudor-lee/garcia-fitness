<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>注册</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true" class="ion-padding dark-bg">
        <div class="register-container">
          <ion-list lines="none" class="dark-list">
            <ion-item class="dark-item">
              <ion-label position="stacked" class="dark-label">账号</ion-label>
              <ion-input
                v-model="account"
                placeholder="请输入邮箱或手机号"
                type="text"
                clear-input
                class="dark-input"
              ></ion-input>
            </ion-item>
            <ion-item class="dark-item">
              <ion-label position="stacked" class="dark-label">昵称</ion-label>
              <ion-input
                v-model="nickname"
                placeholder="请输入昵称"
                type="text"
                clear-input
                class="dark-input"
              ></ion-input>
            </ion-item>
            <ion-item class="dark-item">
              <ion-label position="stacked" class="dark-label">密码</ion-label>
              <ion-input
                v-model="password"
                placeholder="请输入密码"
                type="password"
                clear-input
                class="dark-input"
              ></ion-input>
            </ion-item>
            <ion-item class="dark-item">
              <ion-label position="stacked" class="dark-label">确认密码</ion-label>
              <ion-input
                v-model="confirmPassword"
                placeholder="请再次输入密码"
                type="password"
                clear-input
                class="dark-input"
              ></ion-input>
            </ion-item>
          </ion-list>
          <ion-button expand="block" color="primary" @click="onRegister">
            注册
          </ion-button>
          <ion-button expand="block" fill="outline" @click="onBackToLogin">
            返回登录
          </ion-button>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton
  } from '@ionic/vue'
  import { useRouter } from 'vue-router'
import axiosInstance from '@/api'
  
  const account = ref('')
  const nickname = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  
  const router = useRouter()
  
  const onRegister = () => {
    // 注册逻辑
    if (!account.value || !nickname.value || !password.value || !confirmPassword.value) {
      alert('请填写所有字段')
      return
    }
    if (password.value !== confirmPassword.value) {
      alert('两次输入的密码不一致')
      return
    }
    // 这里可以调用注册API
    console.log('注册', account.value, nickname.value, password.value)
    axiosInstance.post('/api/register', {
      email: account.value,
      name: nickname.value,
      password: password.value
    }).then(res => {
      if (res.data.success) {
        router.push('/login')
      } else {
        console.log(res.data.error)
      }
    })
  }
  
  const onBackToLogin = () => {
    router.push('/login')
  }
  </script>
  
  <style scoped>
  .dark-bg {
    --background: #18181c;
    background: #18181c;
    min-height: 100vh;
  }
  
  .register-container {
    max-width: 400px;
    margin: 60px auto 0 auto;
    padding: 24px;
    background: rgba(35, 35, 43, 0.98);
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  }
  
  .dark-list {
    background: transparent;
  }
  
  .dark-item {
    --background: transparent;
    background: transparent;
  }
  
  .dark-label {
    color: #e0e0e0;
  }
  
  .dark-input {
    --color: #fff;
    color: #fff;
  }
  
  ion-title {
    color: #fff;
  }
  </style>